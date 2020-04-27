/**
 * This file is used to manage proper response to matched intent.
 * The main concept is at 'intents' object. It has functions that 
 * receives WebhookClient (as 'agent') and used it to response messages.
 */

const { name: projectId } = require('../package.json');

const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Bangkok');
moment.locale('th');

const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
  projectId,
});

const { RichResponse, Payload } = require('dialogflow-fulfillment');

const OTP = require('../models/otp.js');
const Menses = require('../models/menses');
const User = require('../models/user');

const wrapper = f => ( (...agent) => ( async () => f(...agent) ) );

const line = str => str.split('\n').map(e => e.trimStart()).join('\n');

const intents = module.exports =  {
  welcome: agent => agent.add('welcome jaa'), // This line indicate that with 'welcome' intents, we send a response message as that text.

  fallback: agent => agent.add('i dont know this word'),

  birthdate: async (agent, userId) => {
    let bd = agent.parameters.birthdate;
    agent.context.set('confirm-age', 3, { birthdate: bd });
    let response = new Payload('LINE', {
      "type": "template",
      "altText": "confirm",
      "template": {
        "type": "confirm",
        "text": `วันเกิดของคุณคือ ${moment(bd).format('วันddddที่ DD MMMM YYYY')} ขณะนี้คุณอายุ ${moment().diff(moment(bd), 'years')} ถูกต้องไหมคะ`,
        "actions": [
          {
            "type": "message",
            "label": "ใช่",
            "text": "ใช่"
          },
          {
            "type": "message",
            "label": "ไม่ใช่",
            "text": "ไม่ใช่"
          }
        ]
      }
    }, {
      sendAsMessage: true,
      rawPayload: false,
    });
    agent.add(response);
  },

  'confirm age': async (agent, userId) => {
    let bd;
    agent.contexts.forEach(e => {
      if (e.name == 'confirm-age') bd = e.parameters.birthdate;
    });
    await db.collection('Users').doc(userId).set({
      birthdate: bd
    });
    agent.add('บันทึกสำเร็จ');
    agent.clearOutgoingContexts();
  },

  name: async (agent, userId) => {
    let name;
    agent.contexts.forEach(e => {
      if (e.name == 'name-followup') name = e.parameters.name;
    });
    await db.collection('Users').doc(userId).set({
      name: name
    });
    agent.add('บันทึกข้อมูลสำเร็จ');
    agent.clearOutgoingContext();
  },

  menses: async (agent, userId, grade) => {
    try {
      // let today = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      let u = new User(db.collection('Users').doc(userId));
      await u.addMenses(grade);
      agent.add(`${moment().format('วันddddที่ DD MMMM')} คุณมีประจำเดือนปริมาณ ${Menses.map[grade]} บันทึกข้อมูลสำเร็จ`);
    } catch (e) {
      return next(err);
    }
  },
  
  profile: async (agent, userId) => {
    let user = await db.collection('Users').doc(userId).get();
    agent.add(line(
      `ข้อมูลของคุณ
      วันเกิด - ${moment(user.get('birthdate')).format('dddd, MMMM Do YYYY')}
      อายุ - ${moment(user.get('birthdate')).diff(moment(), 'years')}
      (... อื่นๆ กำลังตามมา)`));
  },

  otp: async (agent, userId) => {
    let otp = await OTP.createToken(db.collection('Users').doc(userId));
    agent.add(
`⚠️ โปรดอ่านข้อตกลงที่ลิ้งค์ด้านล่างก่อนยินยอมแจ้งรหัสแก่แพทย์ ⚠️
[LINK]
*รหัสสำหรับการเข้าถึงข้อมูลคือ*
${otp}`);
    agent.clearOutgoingContexts();
    return otp;
  },

  'edit - birthdate': async (agent, userId) => {
    agent.setFollowupEvent('birthdate');
    agent.add('คุณต้องการเปลี่ยน วัน/เดือน/ปีเกิด เป็นวันที่เท่าไหร่คะ');
  },
};
 
for (let k in intents) {
  intents[k] = wrapper(intents[k]);
}