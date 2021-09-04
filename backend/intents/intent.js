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

const { RichResponse, Payload, Image } = require('dialogflow-fulfillment');

const OTP = require('../models/otp.js');
const Menses = require('../models/menses');
const User = require('../models/user');
const Message = require('../models/message');

const wrapper = f => ( (...agent) => ( async () => f(...agent) ) );
const line = str => str.split('\n').map(e => e.trimStart()).join('\n');
const clearOutgoingContexts = agent => {
  for (const context of agent.context) {
    agent.context.delete(context.name)
  }
}

const intents = module.exports =  {
  welcome: agent => agent.add('welcome jaa'), // This line indicate that with 'welcome' intents, we send a response message as that text.

  fallback: agent => agent.add('i dont know this word'),

  birthdate: async (agent, userId) => {
    let bd = moment(agent.parameters.birthdate);
    if (bd.isAfter(moment())) bd = bd.subtract(43, 'y');
    agent.context.set('age', 3, { birthdate: bd });
    agent.context.set('confirmage-followup', 3);

    let response = new Payload('LINE', Message.confirmBirthdate(bd), {
      sendAsMessage: true,
      rawPayload: false,
    });
    agent.add(response);
  },

  'confirm age - yes': async (agent, userId) => {
    let bd;
    agent.contexts.forEach(e => {
      if (e.name == 'age') bd = e.parameters.birthdate;
    });
    await db.collection('Users').doc(userId).set({
      birthdate: bd
    });
    agent.add('บันทึกสำเร็จ');
    clearOutgoingContexts(agent);
  },

  'confirm age - no': async (agent, userId) => {
    agent.add('โปรดกรอกวันเกิดใหม่ค่ะ');
    clearOutgoingContexts(agent);
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
    clearOutgoingContexts(agent);
  },

  askMenses: async (agent, userId) => {
    let today = moment();
    let response = new Payload('LINE', Message.askMenses(today), {
      sendAsMessage: true,
      rawPayload: false,
    });
    agent.add(response);
  },

  menses: async (agent, userId) => {
    let date, grade;
    if (agent.parameters['date']) date = agent.parameters['date'];
    if (!agent.parameters['quality']) throw new Error('quality not found');

    const map = {
      no: 0,
      light: 1,
      normal: 2,
      heavy: 3,
      spot: 'spot',
    }
    grade = map[agent.parameters['quality']];
    date = moment(date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    if (date.isAfter(moment())) {
      agent.add('ข้อมูลผิดพลาด (date input is future)');
      clearOutgoingContexts(agent);
      return ;
    }

    let oldMenses = await db.collection('Users').doc(userId).collection('Menses').where('date', '=', date.toDate()).get();
    let newMenses;
    if (!oldMenses.empty) newMenses = new Menses(oldMenses.docs[0].ref, grade, date);
    else newMenses = new Menses(db.collection('Users').doc(userId).collection('Menses').doc(), grade, date);
    await newMenses.save();
    agent.add(`${date.format('วันddddที่ D MMMM')} คุณ${!grade ? 'ไม่' : ''}มีประจำเดือน${grade ? `ปริมาณ${Menses.map[grade]}` : ''} บันทึกข้อมูลสำเร็จ`);
    clearOutgoingContexts(agent);
    let askPainImage = new Image(Message.askPainImage());
    let askPain = new Payload('LINE', Message.askPain(date), {
      sendAsMessage: true,
      rawPayload: false,
    });
    agent.context.set('pain', 3, {
      date: date
    });
    agent.add(askPainImage);
    agent.add(askPain);
  },

  pain: async (agent, userId) => {
    // console.log(agent.contexts);
    let date = agent.context.get('pain').parameters['date'];
    date = moment(date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    let menses = await db.collection('Users').doc(userId).collection('Menses').where('date', '=', date.toDate()).get();
    if (menses.empty) throw new Error('no menses data');
    await menses.docs[0].ref.update({
      pain: agent.parameters['pain-score']
    });

    agent.context.set('drug', 3, {
      date: date
    });
    let askDrug = new Payload('LINE', Message.askDrug(), {
      sendAsMessage: true,
      rawPayload: false,
    });
    agent.context.set('drug', 3, {
      date: date
    });
    agent.add(`${date.format('วันddddที่ D MMMM')} คุณปวดประจำเดือนระดับ ${agent.parameters['pain-score']} บันทึกข้อมูลสำเร็จ`);
    agent.add(askDrug);
  },

  drug: async (agent, userId) => {
    // console.log(agent.contexts);
    let date = agent.context.get('drug').parameters['date'];
    date = moment(date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    let menses = await db.collection('Users').doc(userId).collection('Menses').where('date', '=', date.toDate()).get();
    if (menses.empty) throw new Error('no menses data');
    await menses.docs[0].ref.update({
      drug: agent.parameters['Y-N'] == 'yes'
    });

    let askDrug = new Payload('LINE', Message.askDrug(), {
      sendAsMessage: true,
      rawPayload: false,
    });
    agent.add(`${date.format('วันddddที่ D MMMM')} คุณทาน/ใช้ยา${agent.parameters['Y-N'] == 'yes' ? 'ครบ' : 'ไม่ครบ'}ตามที่กำหนด บันทึกข้อมูลสำเร็จ`);
    agent.add('ฟ้าขอตัวไปเรียบเรียงข้อมูลก่อนนะคะ ขอบคุณสำหรับข้อมูลวันนี้ค่ะ 🙇‍♀️');
  },
  
  profile: async (agent, userId) => {
    let user = await db.collection('Users').doc(userId).get();
    agent.add(line(
      `ข้อมูลของคุณ
      วันเกิด - ${moment(user.get('birthdate')).format('วันddddที่ D MMMM YYYY')}
      อายุ - ${moment(user.get('birthdate')).diff(moment(), 'years')}
      (... อื่นๆ กำลังตามมา)`));
  },

  otp: async (agent, userId) => {
    let otp = await OTP.createToken(db.collection('Users').doc(userId));
    agent.add(
`⚠️ โปรดอ่านข้อตกลงที่ลิ้งค์ด้านล่างก่อนยินยอมแจ้งรหัสแก่แพทย์ ⚠️
https://signb-project.appspot.com/visualize/terms
*รหัสสำหรับการเข้าถึงข้อมูลคือ*
${otp}`);
    clearOutgoingContexts(agent);
    return otp;
  },

  'edit - birthdate': async (agent, userId) => {
    agent.setFollowupEvent('birthdate');
    agent.add('คุณต้องการเปลี่ยน วัน/เดือน/ปีเกิด เป็นวันที่เท่าไหร่คะ');
  },

  /* editMenses: async (agent, userId, grade) => {
    let date;
    agent.contexts.forEach(e => {
      if (e.name == 'edit-menstruation-date-followup') date = e.parameters['date-time'];
    });
    date = moment(date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    let oldMenses = await db.collection('Users').doc(userId).collection('Menses').where('date', '=', date.toDate()).get();
    let newMenses
    if (!oldMenses.empty) newMenses = new Menses(oldMenses.docs[0].ref, grade, date);
    else newMenses = new Menses(db.collection('Users').doc(userId).collection('Menses').doc(), grade, date);
    await newMenses.save();
    agent.add(`${date.format('วันddddที่ D MMMM')} คุณ${!grade ? 'ไม่' : ''}มีประจำเดือน${grade ? `ปริมาณ${Menses.map[grade]}` : ''}นะคะ แก้ไขเรียบร้อยค่ะ`);
    clearOutgoingContexts(agent);
  }, */

  editMenses: async (agent, userId, grade) => {
    let date = agent.context.get('edit-menstruation-date-followup').parameters['date'];
    date = moment(date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    let response = new Payload('LINE', Message.askMenses(date), {
      sendAsMessage: true,
      rawPayload: false,
    });
    agent.add(response);
  },

  notification: async (agent, userId, noti) => {
    let user = new User(db.collection('Users').doc(userId));
    // agent.add(await user.getNotification());
    await user.setNotification(noti);
    agent.add(`${User.mapNoti[noti]}นะคะ แก้ไขเรียบร้อยค่ะ`);
    clearOutgoingContexts(agent);
  }
};
 
for (let k in intents) {
  intents[k] = wrapper(intents[k]);
}