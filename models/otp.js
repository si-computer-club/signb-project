const { name: projectId } = require('../package.json');
const moment = require('moment');

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
    created: +new Date()
  });
  return ref.id;
};

OTP.activate = async function (token) {
  let data = await db.collection('OTP').doc(token).get();
  if (!data.exists) throw new InputError('Incorrect OTP');
  if (moment().isAfter(moment(data.get('created')).add(30, 'm'))) throw new InputError('OTP expired');

  let user = new User(data.get('user'));

  await data.ref.delete();
  return await user.getData();
};

/* OTP.createToken(db.collection('Users').doc('U283cce492091fb358cc954922461780e'));
OTP.activate('9648').then(data => console.log(data.get('birthday'), data.menses[0].get('grade'))); */
