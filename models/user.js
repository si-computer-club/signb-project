const { name: projectId } = require('../package.json');

const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
  projectId,
});

const InputError = require('./error');
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
    let user = (await this.userRef.get()).data();
    let menses = await this.userRef.collection('Menses').get();
    user.menses = [];
    menses.docs.forEach((e, i) => {
      user.menses.push(e.data());
    });
    user.menses.map = Menses.map;
    return user;
  }
}

module.exports = User;