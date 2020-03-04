const { name: projectId } = require('../package.json');
const moment = require('moment');

const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
  projectId,
  keyFilename: './secret/signb-project-1fd20953ab35.json',
});

const wrapper = f => ( (...agent) => ( async () => f(...agent) ) );

module.exports = {
  welcome: wrapper(agent => {
    // console.log(agent);
    agent.add('welcome jaa');
  }),
  fallback: wrapper(agent => {
    agent.add('i dont know this word');
  }),
  test: wrapper(agent => {
    agent.add('testtest');
  }),
  'birthday - yes': wrapper(async (agent, userId) => {
    let bd;
    agent.contexts.forEach(e => {
      if (e.name == 'birthday-followup') {
        bd = e.parameters.birthday;
      }
    });
    await db.collection('Users').doc(userId).set({
      birthday: bd
    });
    agent.add('บันทึกข้อมูลสำเร็จ');
  }),
  profile: wrapper(async (agent, userId) => {
    let user = await db.collection('Users').doc(userId).get();
    // console.log(user);
    agent.add(`ข้อมูลของคุณ
วันเกิด - ${moment(user.get('birthday')).format('dddd, MMMM Do YYYY')}
(... อื่นๆ กำลังตามมา)`);
  }),
};