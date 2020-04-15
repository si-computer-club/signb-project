const express = require('express');
const router = express.Router();
const { name: projectId } = require('../package.json');

//error test
router.get('/err', (req, res, next) => {
  next(new Error('eiei'));
});

router.post('/testroutine', (req, res) => {
  console.log('zapier works!');
  res.send('ok');
});

module.exports = router;