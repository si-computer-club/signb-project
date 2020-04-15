/**
 * The main server file. App Engine run their process by run this file (as described in 'package.json' scripts->start)
 */

const express = require('express');
const app = express();

const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });

const bodyParser = require('body-parser');
const request = require('request');

const port = +process.env.PORT || 8080, ip = process.env.IP || '0.0.0.0';

(async () => {
  await nextApp.prepare();

  // set up routes

  app.use(require(__dirname + '/routes/https-redirect.js')({ httpsPort: app.get('https-port') }));
  app.set('trust proxy', true);

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));
  // parse application/json
  app.use(bodyParser.json());

  app.get('/', async (req, res, next) => {
    nextApp.render(req, res, '/home');
  });

  app.use('/', require('./routes/debug.js'));
  app.use('/', require('./routes/webhook.js'));
  app.use('/', require('./routes/visualize.js'));
  app.get('*', (req, res) => nextApp.getRequestHandler()(req, res));

  app.use((err, req, res, next) => {
    console.error(err);
    res.redirect('/');
  });

  app.listen(port, ip, () => console.log('Server running on http://%s:%s', ip, port));

})().catch(e => console.log(e));

module.exports = app;