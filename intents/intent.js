/**
 * This file is used to manage proper response to matched intent.
 * The main concept is at 'intents' object. It has functions that 
 * receives WebhookClient (as agent) and used it to response messages.
 */

const { name: projectId } = require('../package.json');
const moment = require('moment');

const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
  projectId,
});

const wrapper = f => ( (...agent) => ( async () => f(...agent) ) );

const intents = module.exports =  {
  welcome: agent => agent.add('welcome jaa'), // This line indicate that with 'welcome' intents, we send a response message as that text.

  fallback: agent => agent.add('i dont know this word'),

  test: agent => agent.add('testtest'),

  'birthday - yes': async (agent, userId) => {
    let bd;
    agent.contexts.forEach(e => {
      if (e.name == 'birthday-followup') bd = e.parameters.birthday;
    });
    await db.collection('Users').doc(userId).set({
      birthday: bd
    });
    agent.add('บันทึกข้อมูลสำเร็จ');
  },
  // With 'birthday - yes' intent, we save birthday data to Firestore.
  
  profile: async (agent, userId) => {
    let user = await db.collection('Users').doc(userId).get();
    agent.add(
`ข้อมูลของคุณ
วันเกิด - ${moment(user.get('birthday')).format('dddd, MMMM Do YYYY')}
(... อื่นๆ กำลังตามมา)`);
  },
};

for (let k in intents) {
  intents[k] = wrapper(intents[k]);
}