const { name: projectId } = require('../package.json');

const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Bangkok');
moment.locale('th');

const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
  projectId,
});

const InputError = require('./error');
const Menses = require('./menses');
const User = require('./user');

let OTP = module.exports;

OTP.createToken = async function (userRef) {
  let ref;
  do {
    let code = '';
    while (code.length < 4) {
      code += (~~(Math.random() * 9)) + 1; // https://stackoverflow.com/questions/5971645/what-is-the-double-tilde-operator-in-javascript#comment6890442_5971668
      if (code.length > 1 && code[code.length-1] == code[code.length-2]) code = code.slice(0, -1);
    }
    ref = db.collection('OTP').doc(code);
  } while ((await ref.get()).exists);
  // console.log(ref.id);
  await ref.create({
    user: userRef,
    otp: ref.id,
    created: new Date()
  });
  return ref.id;
};

OTP.activate = async function (token) {
  if (!token) throw new InputError('Empty token');
  let data = await db.collection('OTP').doc(token).get();
  if (!data.exists) throw new InputError('Incorrect OTP');
  let warn = {};
  if (data.get('used')) warn.used = true;
  if (moment().isAfter(moment(data.get('created').toDate()).add(30, 'm'))) warn.expired = true;
  if (data.get('used')) throw new Error('Already used OTP');
  if (moment().isAfter(moment(data.get('created').toDate()).add(30, 'm'))) throw new InputError('OTP expired');

  let user = new User(data.get('user'));

  await data.ref.update({
    used: true
  });
  let out = await user.getData();
  if (Object.keys(warn).length) out.warn = warn;
  return out;
};

/* let user = new User(db.collection('Users').doc('Ue25c0b5430760b22118c4857d69613e9'));
user.getData().then(res => console.log(res));

OTP.createToken(db.collection('Users').doc('U283cce492091fb358cc954922461780e'));
OTP.activate('9648').then(data => console.log(data.get('birthday'), data.menses[0].get('grade'))); */
