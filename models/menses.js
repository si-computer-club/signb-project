const { name: projectId } = require('../package.json');

const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Bangkok');
moment.locale('th');

const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
  projectId,
});

class Menses {
  static get map () {
    return ({
      0: 'ไม่มี',
      1: 'น้อย',
      2: 'ปานกลาง',
      3: 'มาก',
      spot: '(Spot bleeding)',
    });
  };

  constructor (mensesRef, grade, date) {
    if (!Menses.map[grade]) throw new Error('Invalid grade, must be 0, 1, 2, 3, or "spot"');

    this.mensesRef = mensesRef;
    this.grade = grade;
    this.date = moment(date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
  }

  async save() {
    return await this.mensesRef.set({
      date: this.date,
      grade: this.grade,
    });
  }

  async get() {
    return await this.mensesRef.get();
  }
}

module.exports = Menses;