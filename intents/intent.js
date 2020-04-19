/**
 * This file is used to manage proper response to matched intent.
 * The main concept is at 'intents' object. It has functions that 
 * receives WebhookClient (as 'agent') and used it to response messages.
 */

const { name: projectId } = require('../package.json');
const moment = require('moment');

const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
  projectId,
});

const OTP = require('../models/otp.js');

const wrapper = f => ( (...agent) => ( async () => f(...agent) ) );

const line = str => str.split('\n').map(e => e.trimStart()).join('\n');

const intents = module.exports =  {
  welcome: agent => agent.add('welcome jaa'), // This line indicate that with 'welcome' intents, we send a response message as that text.

  fallback: agent => agent.add('i dont know this word'),

  test: agent => agent.add('testtest'),

  /* birthday: async (agent, userId) => {
    let bd;
    agent.contexts.forEach(e => {
      if (e.name == 'birthday-followup') bd = e.parameters.birthday;
    });
    
    agent.add('บันทึกข้อมูลสำเร็จ');

  }, */

  birthday: async (agent, userId) => {
    let bd = agent.parameters.birthday;
    agent.context.set('confirm-age', 3, { birthday: bd });
    agent.add(`วันเกิดของคุณคือ ${moment(bd).format('dddd, MMMM Do YYYY')} ขณะนี้คุณอายุ ${moment().diff(moment(bd), 'years')} ถูกต้องไหมคะ`);
  },

  'confirm age': async (agent, userId) => {
    let bd;
    agent.contexts.forEach(e => {
      if (e.name == 'confirm-age') bd = e.parameters.birthday;
    });
    await db.collection('Users').doc(userId).set({
      birthday: bd
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

  menses: async (agent, userId) => {
    let grade;
    agent.contexts.forEach(e => {
      if (e.name == 'menses-followup') grade = e.parameters.grade;
    });
    let today = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    await db.collection('Users').doc(userId).collection('Menses').add({
      date: today,
      grade,
    });
    agent.add('บันทึกข้อมูลสำเร็จ');
  },
  
  profile: async (agent, userId) => {
    let user = await db.collection('Users').doc(userId).get();
    agent.add(line(
      `ข้อมูลของคุณ
      วันเกิด - ${moment(user.get('birthday')).format('dddd, MMMM Do YYYY')}
      อายุ - ${moment(user.get('birthday')).diff(moment(), 'years')}
      (... อื่นๆ กำลังตามมา)`));
  },

  otp: async (agent, userId) => {
    let otp = await OTP.createToken(db.collection('Users').doc(userId));
    agent.add(
`⚠️ โปรดอ่านข้อตกลงที่ลิ้งค์ด้านล่างก่อนยินยอมแจ้งรหัสแก่แพทย์ ⚠️
[LINK]
***รหัสสำหรับการเข้าถึงข้อมูลคือ***
${otp}`);
    return otp;
  },
};
 
for (let k in intents) {
  intents[k] = wrapper(intents[k]);
}