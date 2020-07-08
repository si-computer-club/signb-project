/**
 * This file is used to manage routes that come from webhook from Dialogflow.
 */

const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();
const { name: projectId } = require('../package.json');

const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
  projectId,
});

const { WebhookClient } = require('dialogflow-fulfillment');
const intent = require('../intents/intent.js');

router.post('/', async (req, res, next) => {
  res.send('ok');
});

router.get('/webhook', async (req, res, next) => {
  res.send('ok');
});

router.post('/webhook/line', async (req, res, next) => {
  let event = req.body.events[0];
  if (event.type === "message" && event.message.type === "text") {
    req.headers.host = "dialogflow.cloud.google.com";
    await fetch('https://dialogflow.cloud.google.com/v1/integrations/line/webhook/c5cf1f15-6655-4c57-b12e-05907201774a', {
      method: 'post',
      headers: req.headers,
      body: JSON.stringify(req.body),
    });
    res.send('ok');
  }
  else {
    res.send('ok');
  }
});

router.post('/webhook/dialogflow', async (req, res, next) => { // We respond to POST request to '/webhook' as follows
  try {
    const agent = new WebhookClient({request: req, response: res});

    let reqdata = agent.originalRequest;
    console.log(`
intent: ${agent.intent}
locale: ${agent.locale}
query: ${agent.query}
source: ${reqdata.source}
session: ${agent.session}
action: ${agent.action}
parameters: ${JSON.stringify(agent.parameters)}`);

    /**
     * Here, we respond to the matched intents by functions that is described in 'intent.js' file.
     */
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', intent.welcome(agent));
    intentMap.set('Default Fallback Intent', intent.fallback(agent));
    if (reqdata.source == 'line') {
      const userId = reqdata.payload.data.source.userId;
      intentMap.set('get birthdate', intent.birthdate(agent, userId));
      intentMap.set('confirm age', intent['confirm age'](agent, userId));
      intentMap.set('profile', intent.profile(agent, userId));
      intentMap.set('name', intent.name(agent, userId));
      intentMap.set('menstruation (y/n) - no', intent.menses(agent, userId, 0));
      intentMap.set('menstruation (y/n) - yes - light', intent.menses(agent, userId, 1));
      intentMap.set('menstruation (y/n) - yes - normal', intent.menses(agent, userId, 2));
      intentMap.set('menstruation (y/n) - yes - heavy', intent.menses(agent, userId, 3));
      intentMap.set('menstruation (y/n) - yes - spot', intent.menses(agent, userId, 'spot'));
      intentMap.set('get pin', intent.otp(agent, userId));
      intentMap.set('edit - menstruation - date - no', intent.editMenses(agent, userId, 0));
      intentMap.set('edit - menstruation - date - yes - light', intent.editMenses(agent, userId, 1));
      intentMap.set('edit - menstruation - date - yes - normal', intent.editMenses(agent, userId, 2));
      intentMap.set('edit - menstruation - date - yes - heavy', intent.editMenses(agent, userId, 3));
      intentMap.set('edit - menstruation - date - yes - spot', intent.editMenses(agent, userId, 'spot'));
      intentMap.set('notification - none', intent.notification(agent, userId, 'none'));
      intentMap.set('notification - regular', intent.notification(agent, userId, 'regular'));
    }
    await agent.handleRequest(intentMap);

    /*
    if (reqdata.source == 'line') await db.collection('Messages').doc().set({
      userId: reqdata.payload.data.source.userId,
      message: reqdata.payload.data.message.text,
      timestamp: reqdata.payload.data.timestamp,
      intent: agent.intent,
      locale: agent.locale,
      action: agent.action,
      parameters: agent.parameters,
    }); */

  } catch (err) {
    return next(err);
  }
});

module.exports = router;