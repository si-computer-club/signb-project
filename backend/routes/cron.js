const express = require('express');
const router = express.Router();
const { name: projectId } = require('../package.json');

const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Bangkok');
moment.locale('th');

const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
  projectId,
});

const Line = require('@line/bot-sdk');
const line = new Line.Client({
  channelAccessToken: require('../secret/secret.json').line.channelAccessToken
});

const OTP = require('../models/otp');
const User = require('../models/user');
const Message = require('../models/message');

// let jew = 'U283cce492091fb358cc954922461780e';

router.get('/cron/menses', async (req, res, next) => {
  try {
    let today = moment();
    let users = (await db.collection('Users').get()).docs;
    users.forEach(async (e, i) => {
      let user = new User(e.ref);
      if (await user.getMenses()) return;
      if (await user.getNotification() == 'none') return ;
      await line.pushMessage(e.ref.id, Message.askMenses(today));
    });
    res.send('ok');
  } catch (e) {
    return next(e);
  }
});

router.get('/cron/clearotp', async (req, res, next) => {
  try {
    let otp = (await db.collection('OTP').orderBy('created', 'asc').get()).docs, i;
    while (otp.length && moment().isAfter(moment((i = otp.shift()).get('created').toDate()).add(48, 'h'))) await i.ref.delete();
    res.send('ok');
  } catch (e) {
    return next(e);
  }
});

module.exports = router;