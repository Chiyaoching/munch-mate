/*
 * @Author: Seven Yaoching-Chi 
 * @Date: 2024-06-06 15:46:51 
 * @Last Modified by: Seven Yaoching-Chi
 * @Last Modified time: 2024-06-06 15:47:16
 */

const path = require('path');
const express = require('express');
const session = require('express-session');
const http = require('http');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {
  log4js, log, err, warn,
} = require('./helper/logger');
const {port, mongo_url} = require('./config');
const mongoose = require('mongoose');

require('./constant/global');

const infoLog = (...args) => log('[SERVER]', ...args);
const errLog = (...args) => err('[SERVER]', ...args);
const warnLog = (...args) => warn('[SERVER]', ...args);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();

const sessionHandler = session({
  secret: 'none',
  rolling: true,
  resave: true,
  saveUninitialized: true,
});

app.use(sessionHandler);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression()); // gzip mode.


mongoose.connect(mongo_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

http.createServer(app).listen(port, () => { infoLog(`Server running at: http://localhost:${port}`); });

app.use('/', express.static(path.join(__dirname, '../build')));
app.use('/api/prompt', require('./api/openai'));
app.use('/api/auth', require('./api/auth'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

process
  .on('uncaughtException', (err) => {
    errLog('Uncaught Exception: ', err.message, ', Abort to exit with code: 1');
    errLog(err.stack);
    log4js.shutdown(() => {
      process.exit(1);
    });
  })
  .on('SIGTERM', () => {
    warnLog('System Terminate, Abort to exit with code: 0');
    log4js.shutdown(() => {
      process.exit(0);
    });
  })
  .on('SIGINT', () => {
    warnLog('System Interrupt, Abort to exit with code: 0');
    log4js.shutdown(() => {
      process.exit(0);
    });
  })
  .on('exit', async (code) => {
    console.log(`System Exit: ${code}`);
  });
