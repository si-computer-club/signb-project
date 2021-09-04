const express = require('express');
const cors = require('cors');
const router = express.Router();
const { name: projectId } = require('../package.json');

const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Bangkok');
moment.locale('th');

const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
  projectId,
});

const OTP = require('../models/otp');
const User = require('../models/user');

router.get('/visualize/otp/create', async (req, res, next) => {
  try {
    res.send(await OTP.createToken(db.collection('Users').doc('Ue25c0b5430760b22118c4857d69613e9')));
  } catch (e) {
    return next(e);
  }
});

router.get('/visualize/terms', async (req, res, next) => {
  try {
    res.send('หลังจากใส่รหัสจะถือว่าผู้ใช้ยินยอมให้แพทย์เข้าถึงข้อมูลส่วนตัวทั้งหมดที่มีบันทึกในระบบ');
  } catch (e) {
    return next(e);
  }
});

router.post('/visualize/otp/activate', cors(), async (req, res, next) => {
  try {
    /* res.set('Access-Control-Allow-Origin', '*');
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE"); */
    let data = await OTP.activate(req.body.token);
    // console.log(data.menses[0].date.toDate());
    data.menses.forEach((e, i, arr) => {
      if (e.date instanceof Firestore.Timestamp) arr[i].date = moment(e.date.toDate()).format();
    });
    res.json(data);
  } catch (e) {
    if (e.name == 'InputError') return res.json(e);
    return next(e);
  }
});

module.exports = router;