const express = require('express');
const router = express.Router();
const { name: projectId } = require('../package.json');

const OTP = require('../models/otp');

router.post('/visualize/otp');

router.get('/visualize/otp/create', async (req, res, next) => {
  try {
    await OTP.createToken(req.query.userRef);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;