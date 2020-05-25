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

// let jew = 'U283cce492091fb358cc954922461780e';

router.get('/cron/menses', async (req, res, next) => {
  try {
    let today = moment();
    let users = (await db.collection('Users').get()).docs;
    users.forEach(async (e, i) => {
      let user = new User(e.ref);
      if (await user.getMenses()) return;
      await line.pushMessage(e.ref.id, {
        type: 'template',
        altText: 'สอบถามประจำเดือน กรุณาตอบในโทรศัพท์',
        template: {
          type: 'confirm',
          text: `วันนี้ (${today.format('D/M')}) คุณมีประจำเดือนไหมคะ`,
          actions: [ {
            type: 'message',
            label: 'มี',
            text: `วันที่ ${today.format('D/M/Y')} มีประจำเดือน`
          }, {
            type: 'message',
            label: 'ไม่มี',
            text: `วันที่ ${today.format('D/M/Y')} ไม่มีประจำเดือน`
          } ]
        }
      });
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