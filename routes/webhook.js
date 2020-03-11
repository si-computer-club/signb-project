/**
 * This file is used to manage routes that come from webhook from Dialogflow.
 */

const request = require('request');
const express = require('express');
const router = express.Router();
const { name: projectId } = require('../package.json');

const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
  projectId,
});

const { WebhookClient } = require('dialogflow-fulfillment');
const intent = require('../intents/intent.js');

router.get('/webhook', async (req, res, next) => {
  res.send('ok');
});

router.post('/webhook', async (req, res, next) => { // We respond to POST request to '/webhook' as follows
  try {
    const agent = new WebhookClient({request: req, response: res});

    let reqdata = agent.originalRequest;
    /* console.log('agentVersion: ' + agent.agentVersion);
    console.log('originalRequest: ' + JSON.stringify(reqdata)); */
    console.log(`
intent: ${agent.intent}
locale: ${agent.locale}
query: ${agent.query}
source: ${reqdata.source}
session: ${agent.session}
action: ${agent.action}
parameters: ${JSON.stringify(agent.parameters)}`);

    /* let event = req.body.events[0];
    let userId = event.source.userId;
    let timestamp = event.timestamp;
    let replyToken = event.replyToken;
    let userText = '[Event type is not message]';
    if (event.type === "message") userText = event.message.type === "text" ? event.message.text : `[Message type is '${event.message.type}']`; */

    /**
     * Here, we respond to the matched intents by functions that is described in 'intent.js' file.
     */
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', intent.welcome(agent));
    intentMap.set('Default Fallback Intent', intent.fallback(agent));
    intentMap.set('test', intent.test(agent));
    if (reqdata.source == 'line') {
      intentMap.set('birthday - yes', intent['birthday - yes'](agent, reqdata.payload.data.source.userId));
      intentMap.set('profile', intent.profile(agent, reqdata.payload.data.source.userId));
    }
    await agent.handleRequest(intentMap);

    /**
     * if messages come from LINE, we should keep them in DB as well.
     */
    if (reqdata.source == 'line') await db.collection('Messages').doc().set({
      userId: reqdata.payload.data.source.userId,
      message: reqdata.payload.data.message.text,
      timestamp: reqdata.payload.data.timestamp,
      intent: agent.intent,
      locale: agent.locale,
      action: agent.action,
      parameters: agent.parameters,
    });

  } catch (err) { // just the dumbass useless error catch
    return next(err);
  }
});

module.exports = router;