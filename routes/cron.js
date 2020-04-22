const express = require('express');
const router = express.Router();
const { name: projectId } = require('../package.json');

const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
  projectId,
});

const Line = require('@line/bot-sdk');
const line = new Line.Client({
  channelAccessToken: '5Y57DXNBVFBCryr0iCidw7Pvm4ccUePOQrOw16zP3jKWSUdJWJuFC3YLobtNG+z0ZUdPr7hkGDEMTv0H2hIOXdy29AyOdCffjUNoDNYFb+dLtSO4r3f9nZY7kajzTH3neG5wFeGR6AAHGxz8nVS7YgdB04t89/1O/w1cDnyilFU='
});

const OTP = require('../models/otp');
const User = require('../models/user');

router.get('/cron/menses', async (req, res, next) => {
  try {
    let users = (await db.collection('Users').get()).docs;
    users.forEach(async (e, i) => {
      await line.pushMessage(e.ref.id, {
        type: 'text',
        text: 'วันนี้มีประจำเดือนไหมคะ',
      });
    });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;