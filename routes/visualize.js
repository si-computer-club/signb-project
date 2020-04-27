const express = require('express');
const cors = require('cors');
const router = express.Router();
const { name: projectId } = require('../package.json');

const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
  projectId,
});

const OTP = require('../models/otp');
const User = require('../models/user');

router.get('/addmenses', (req, res) => {
  let user = new User(db.collection('Users').doc('U283cce492091fb358cc954922461780e'));
  user.addMenses(3);
  user.addMenses(2);
  user.addMenses(3);
  user.addMenses(1);
});

router.get('/visualize/otp/create', async (req, res, next) => {
  try {
    res.send(await OTP.createToken(db.collection('Users').doc('U283cce492091fb358cc954922461780e')));
  } catch (e) {
    return next(e);
  }
});

router.post('/visualize/otp/activate', cors(), async (req, res, next) => {
  try {
    let data = await OTP.activate(req.body.token);
    console.log(data.menses[0].date.toDate());
    data.menses.forEach((e, i, arr) => {
      if (e.date instanceof Firestore.Timestamp) arr[i].date = e.date.toDate();
    });
    res.json(data);
  } catch (e) {
    if (e.name == 'InputError') return res.json(e);
    return next(e);
  }
});

module.exports = router;