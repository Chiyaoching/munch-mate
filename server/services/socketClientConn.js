/*
 * @Author: Seven Yaoching-Chi
 * @Date: 2023-02-15 17:13:11
 * @Last Modified by:   Seven Yaoching-Chi
 * @Last Modified time: 2023-02-15 17:13:11
 */

const WebSocket = require('ws');
const { log, err, warn } = require('../helper/logger');

const infoLog = (...args) => log('[SERVICE]', ...args);
const errLog = (...args) => err('[SERVICE]', ...args);

const monitorServerSendMsgFormat = (msg) => JSON.stringify(msg);
const monitorServerRecvMsgFormat = (msg) => msg.toString('utf-8');

class SocketClientConn {
  constructor(type, url) {
    this.type = type;
    this.url = url;
    this.wsConn = null;
    this.isCloseManually = false;
    this.retryTime = 1000;
    this.retryTimer = null;
  }

  register(callback) {
    if (this.wsConn) {
      this.wsConn.close();
      this.wsConn = null;
    }
    this.wsConn = new WebSocket(this.url);

    this.wsConn.on('open', () => {
      this.isCloseManually = false;
      infoLog(`${this.type} open.`);
      callback(null, { status: 'ok' });
    });

    this.wsConn.on('error', (err) => {
      infoLog(`${this.type} connection failed.`, err);
      callback(err, { status: 'fail' });
    });

    this.wsConn.on('message', (msg) => {
      if (this.type === 'MonitorServer') {
        callback(null, { message: monitorServerRecvMsgFormat(msg) });
      }
    });

    this.wsConn.on('close', () => {
      infoLog(`${this.type} connection closed.`);
      if (!this.isCloseManually) {
        clearTimeout(this.retryTimer);
        this.retryTimer = setTimeout(() => {
          this.register(callback);
          if (this.retryTime < 5000) this.retryTime += 50;
        }, this.retryTime);
      }
    });
  }

  sendMsg(msg) {
    try {
      infoLog(`Send command to ${this.type} : ${JSON.stringify(msg)}`);
      if (this.type === 'MonitorServer') {
        this.wsConn.send(monitorServerSendMsgFormat(msg));
      }
    } catch (err) {
      errLog(err.toString());
    }
  }

  close(clientSessionId = null) {
    this.isCloseManually = true;
    this.wsConn.close();
    infoLog(`${this.type} closed ${clientSessionId && `by client connection: ${clientSessionId}.`}`);
  }
}

module.exports = SocketClientConn;
