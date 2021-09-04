/**
 * The main server file. App Engine run their process by run this file (as described in 'package.json' scripts->start)
 */

const express = require('express');
const app = express();

const dev = process.env.NODE_ENV !== 'production';
const port = +process.env.PORT || 8080, ip = process.env.IP || '0.0.0.0';

(async () => {
  // set up routes

  // app.use(require(__dirname + '/routes/https-redirect.js')({ httpsPort: app.get('https-port') })); // config in app.yaml instead
  app.set('trust proxy', true); // https://cloud.google.com/appengine/docs/standard/nodejs/runtime#https_and_forwarding_proxies

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get('/', async (req, res, next) => {
    res.send('dont come here');
  });

  app.use('/', require('./routes/debug.js'));
  app.use('/', require('./routes/cron.js'));
  app.use('/', require('./routes/webhook.js'));
  app.use('/', require('./routes/visualize.js'));

  app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send('error');
    // res.redirect('/');
  });

  app.listen(port, ip, () => console.log('Server running on http://%s:%s', ip, port));

})().catch(e => console.log(e));

module.exports = app;