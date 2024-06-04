/*
 * @Author: Seven Yaoching-Chi
 * @Date: 2022-12-07 16:34:44
 * @Last Modified by: Seven Yaoching-Chi
 * @Last Modified time: 2024-05-23 18:47:29
 */

const fs = require('fs');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const {
  getChannelSettings, updateChannelSettings, addMultiviewerSettings, getMultiviewerSettings, updateMultiviewerSettings, deleteMultiviewerSettings,
  createSdkMonitorConnection, removeSdkMonitorUserConnection,
} = require('../controller');
const { log, err, warn } = require('../helper/logger');

const infoLog = (...args) => log('[SOCKET]', ...args);
const errLog = (...args) => err('[SOCKET]', ...args);
const connectionPool = {};
const monitoringPool = {};
const sdkMonitorServerPool = {};
const msgFormat = (msg) => JSON.stringify(msg);
const sendMsg = (conn, msg) => conn && conn.send(msgFormat(msg));
const broadcastAll = (msg, excludeConn = null) => {
  Object.values(connectionPool).filter((conn) => (excludeConn ? conn !== excludeConn : conn)).forEach((conn) => {
    conn.send(msgFormat(msg));
  });
};

function SocketServer(server) {
  try {
    const wsServer = new WebSocket.WebSocketServer({ server, path: '/' });
    wsServer.on('connection', (conn, req) => {
      conn.sessionId = uuidv4();
      conn.services = {};
      connectionPool[conn.sessionId] = conn;
      infoLog(`User Conn [${conn.sessionId}] accepted from ${req.socket.remoteAddress}. (${Object.keys(connectionPool).length})`);
      // send the setting file for channel init.
      sendMsg(conn, getChannelSettings());
      setTimeout(() => {
        sendMsg(conn, getMultiviewerSettings());
      }, 1000);

      conn.on('message', (event) => {
        const msg = JSON.parse(event);
        const { action, data } = msg;
        // console.log(msg);
        switch (action) {
          case 'updateChannelSettings':
            updateChannelSettings(data);
            broadcastAll(getChannelSettings(), conn);
            break;
          case 'addMultiviewer':
            addMultiviewerSettings(data);
            broadcastAll(getMultiviewerSettings());
            break;
          case 'updateMultiviewer':
            updateMultiviewerSettings(data);
            broadcastAll(getMultiviewerSettings());
            break;
          case 'deleteMultiviewer':
            deleteMultiviewerSettings(data);
            broadcastAll(getMultiviewerSettings());
            break;
          case 'bandwidthRecord':
            monitoringPool[conn.sessionId] = { ...data, ip: req.socket.remoteAddress };
            break;
          case 'grabMonitoring':
            sendMsg(conn, { action: 'monitoringStatistics', data: monitoringPool });
            break;
          case 'registerMonitorServer': {
            const backendId = data?.backendId;
            if (!backendId) {
              errLog('Need the parameter for backendId.');
              sendMsg(conn, { action: 'registerMonitorServer', data: 'Need the parameter for backendId.' });
              return;
            }
            if (!sdkMonitorServerPool[backendId]) {
              infoLog(`User conn [${conn.sessionId}] is trying to establish the SDK Monitor Connection.`);
              createSdkMonitorConnection(conn.sessionId, (err, result) => {
                if (err) {
                  errLog(err);
                  sendMsg(conn, { action: 'registerMonitorServer', data: err });
                } else if (result.action === 'createSdkMonitorConn') {
                  sdkMonitorServerPool[backendId] = result.data;
                  sdkMonitorServerPool[backendId].isRegistered = true;
                } else if (result.action === 'registerSdkMonitorConn') {
                  sendMsg(conn, { action: 'registerMonitorServer', data: 'ok' });
                } else if (result.action === 'getTimeCode') {
                  sdkMonitorServerPool?.[backendId]?.broadcastUsers.forEach((userConnId) => {
                    sendMsg(connectionPool[userConnId], { action: 'timeCodeStr', data: result.data });
                  });
                } else if (result.action === 'getChannels') {
                  sdkMonitorServerPool?.[backendId]?.broadcastUsers.forEach((userConnId) => {
                    sendMsg(connectionPool[userConnId], { action: 'monitorChannels', data: result.data });
                  });
                } else if (result.action === 'getGFXStatus') {
                  sdkMonitorServerPool?.[backendId]?.broadcastUsers.forEach((userConnId) => {
                    sendMsg(connectionPool[userConnId], { action: 'GFXStatus', data: result.data });
                  });
                }
              });
            } else {
              infoLog(`SDK MonitorServer Already existed: [${backendId}]`);
              sendMsg(conn, { action: 'registerMonitorServer', data: 'ok' });
              sdkMonitorServerPool?.[backendId]?.broadcastUsers.push(conn.sessionId);
            }
          }
            break;
          case 'sendMonitorEvent': {
            const backendId = data?.data?.backendId;
            if (sdkMonitorServerPool[backendId] && sdkMonitorServerPool[backendId].isRegistered) {
              sdkMonitorServerPool[backendId].socket.sendMsg(data);
              // sdkMonitorServerPool[backendId].isRegistered = true;
            // } else {
            //   infoLog('SDK MonitorServer has sent the command, skip.');
            }
          }
            break;
          default:
            break;
        }
      });

      conn.on('close', () => {
        delete connectionPool[conn.sessionId];
        delete monitoringPool[conn.sessionId];
        // remove the broadcast users from sdk monitor server.
        const result = removeSdkMonitorUserConnection(sdkMonitorServerPool, conn.sessionId);
        if (result) {
          const { targetBackend, broadcastUsers } = result;
          sdkMonitorServerPool[targetBackend].broadcastUsers = broadcastUsers;
          if (broadcastUsers.length === 0) {
            sdkMonitorServerPool[targetBackend].socket.close(conn.sessionId);
            delete sdkMonitorServerPool[targetBackend];
          } else {
            infoLog(`SDK MonitorServer ${targetBackend} still using (${broadcastUsers.length})`);
          }
        }
        infoLog(`User Conn closed: [${conn.sessionId}].  (${Object.keys(connectionPool).length})`);
      });

      conn.on('error', (err) => { throw new Error(err); });
    });
  } catch (err) {
    errLog(err);
  }
}

module.exports = SocketServer;
