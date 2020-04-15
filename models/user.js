const { name: projectId } = require('../package.json');
const moment = require('moment');

const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
  projectId,
});

const Menses = require('./menses');

class User {
  constructor (userRef) {
    this.userRef = userRef;
  }
  
  async addMenses(grade) {
    let menses = new Menses(this.userRef.collection('Menses').doc(), grade);
    return await menses.save();
  }

  async getData() {
    let user = await this.userRef.get();
    let menses = await this.userRef.collection('Menses').get();
    user.menses = menses.docs;
    return user;
  }
}

module.exports = User;