const { name: projectId } = require('../package.json');
const moment = require('moment');

const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
  projectId,
});

class Menses {
  static get map () {
    return ({
      0: 'none',
      1: 'light',
      2: 'moderate',
      3: 'heavy',
    });
  };

  constructor (mensesRef, grade) {
    if (!Menses.map[grade]) throw new Error('Invalid grade, must be 0, 1, 2 or 3');

    this.mensesRef = mensesRef;
    this.grade = grade;
  }

  async save() {
    return await this.mensesRef.set({
      date: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
      grade: this.grade,
    });
  }

  async get() {
    return await this.mensesRef.get();
  }
}

module.exports = Menses;