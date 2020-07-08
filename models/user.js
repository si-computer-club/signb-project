const { name: projectId } = require('../package.json');

const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Bangkok');
moment.locale('th');

const today = () => moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
  projectId,
});

const InputError = require('./error');
const Menses = require('./menses');

class User {
  static get mapNoti () {
    return ({
      regular: 'แจ้งเตือนปกติ',
      none: 'ปิดการแจ้งเตือน',
    });
  };
  
  constructor (userRef) {
    this.userRef = userRef;
  }
  
  async addMenses(grade, date = today()) {
    let prev = await this.userRef.collection('Menses').where('date', '=', date.toDate()).get();
    let menses;
    // console.log(prev.docs);
    if (!prev.empty) menses = new Menses(prev.docs[0].ref, grade);
    else menses = new Menses(this.userRef.collection('Menses').doc(), grade);
    return await menses.save();
  }

  async getMenses(date = today()) {
    let menses = await this.userRef.collection('Menses').where('date', '=', date).get();
    if (menses.empty) return null;
    return menses.docs[0];
  }

  async getData() {
    let user = (await this.userRef.get()).data();
    let menses = await this.userRef.collection('Menses').get();
    user.menses = [];
    menses.docs.forEach((e, i) => {
      user.menses.push(e.data());
    });
    // user.menses.map = Menses.map;
    return user;
  }

  async setNotification(noti = 'regular') {
    if (!User.mapNoti[noti]) throw new Error('Invalid noti, must be "regular" or "none"');
    await this.userRef.update({
      notification: noti
    });
    return noti;
  }
  
  async getNotification() {
    let data = (await this.userRef.get()).data();
    return data.notification;
  }
}

module.exports = User;