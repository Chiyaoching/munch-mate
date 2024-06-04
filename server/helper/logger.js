/*
 * @Author: Seven Yaoching-Chi
 * @Date: 2022-11-29 14:31:16
 * @Last Modified by: Seven Yaoching-Chi
 * @Last Modified time: 2023-07-27 16:21:47
 */

const log4js = require('log4js');
const { logPath } = require('../config');

log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: `${logPath}/logs/server.log`,
      maxLogSize: 15 * 1024 * 1024,
      backups: 1,
      layout: {
        type: 'pattern',
        pattern: '%d{dd/MM/yyyy hh:mm:ss} %-5p %m',
      },
    },
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%[[%d{dd/MM/yyyy hh:mm:ss}] [%p] %] %m',
      },
    },
  },
  categories: {
    default: { appenders: ['file', 'console'], level: 'info' },
    trace: { appenders: ['file'], level: 'info' },
  },
});

const logger = log4js.getLogger();
const errLogger = log4js.getLogger('error');

/* TRACE NEW START OF SERVICE */
const traceLogger = log4js.getLogger('trace');
const infoLog = (e) => traceLogger.info(e);
infoLog('-------------------------------------------------------------------');
infoLog('---------------------------- FIRST LOG ----------------------------');
infoLog('-------------------------------------------------------------------');
/* END TRACE NEW START OF SERVICE */

module.exports = {
  log4js,
  log(type, ...args) {
    const msg = `${type}: ${args
      .map((item) => JSON.stringify(item).replace(/"/g, ''))
      .join(' ')}`;
    logger.info(msg);
    return msg;
  },
  err(type, ...args) {
    const msg = `${type}: ${args
      .map((item) => JSON.stringify(item).replace(/"/g, ''))
      .join(' ')}`;
    errLogger.error(msg);
    return msg;
  },
  warn(type, ...args) {
    const msg = `${type}: ${args
      .map((item) => JSON.stringify(item).replace(/"/g, ''))
      .join(' ')}`;
    logger.info(msg);
    return msg;
  },
};
