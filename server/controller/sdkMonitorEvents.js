/*
 * @Author: Seven Yaoching-Chi
 * @Date: 2022-12-27 17:24:20
 * @Last Modified by: Seven Yaoching-Chi
 * @Last Modified time: 2023-04-12 14:25:45
 */

const Pako = require('pako');
const { monitorServerUrl } = require('../config');
const SocketClientConn = require('../services/socketClientConn');
const { log, err, warn } = require('../helper/logger');

const infoLog = (...args) => log('[SOCKET]', ...args);
const errLog = (...args) => err('[SOCKET]', ...args);

const createSdkMonitorConnection = (userConnId, callback) => {
  let lastTCStr = '';
  let lastChannelStatus = '';
  let lastGFXStatus = '';
  const [protocol, hostname, port] = monitorServerUrl.split(':');
  const monitorServerConn = new SocketClientConn('MonitorServer', `${protocol === 'https' ? 'wss' : 'ws'}:${hostname}:${port}/ws`);
  callback(null, { action: 'createSdkMonitorConn', data: { socket: monitorServerConn, isRegistered: false, broadcastUsers: [userConnId] } });

  monitorServerConn.register((err, result) => {
    if (err) {
      callback(err);
    }
    if (result.status) {
      if (result.status === 'ok') {
        callback(null, { action: 'registerSdkMonitorConn', data: result.status });
      } else {
        callback('Register to SDK MonitorServer failed');
      }
    }
    if (result.message) {
      const rawData = JSON.parse(result.message);
      if (rawData.name === 'postChannelData') {
        const binData = Buffer.from(rawData.data, 'base64');
        const decodedData = Pako.inflate(binData);
        const strData = String.fromCharCode.apply(null, new Uint16Array(decodedData));

        const {
          timeReference, gfx, gfxPreloadStatus, tally, ...rest
        } = JSON.parse(strData);
        const { videoFormat, ...channels } = Object.keys(rest).reduce((all, val) => ({ ...all, [val]: val !== 'videoFormat' ? { status: rest[val]?.status, cameraId: rest[val]?.cameraId, mode: rest[val]?.mode } : rest[val] }), {});
        if (gfx) {
          const gfxStatus = JSON.stringify(gfx);
          if (lastGFXStatus !== gfxStatus) {
            lastGFXStatus = gfxStatus;
            const formatGFXStatus = gfx?.reduce((all, val) => {
              if (!all[val.gfxChannel]) all[val.gfxChannel] = [];
              if (val.isEnable) {
                all[val.gfxChannel].push(val.channelId);
              }
              return all;
            }, {});
            callback(null, { action: 'getGFXStatus', data: formatGFXStatus });
          }
        }

        const channelStatus = JSON.stringify(channels);
        if (lastChannelStatus !== channelStatus) {
          lastChannelStatus = channelStatus;
          callback(null, { action: 'getChannels', data: channels });
        }

        const TCArr = timeReference?.display.replace(/;/g, ':').split(':');
        const TCStr = TCArr.slice(0, -1).join(':');
        if (lastTCStr !== TCStr) {
          lastTCStr = TCStr;
          callback(null, { action: 'getTimeCode', data: lastTCStr });
        }
      }
    }
  });
};

const findSdkMonitorConnection = (sdkMonitorServerPool, userConnId) => {
  let targetBackend = null;
  Object.keys(sdkMonitorServerPool).forEach((backendId) => {
    if (sdkMonitorServerPool[backendId].broadcastUsers.find((id) => id === userConnId)) {
      targetBackend = backendId;
    }
  });
  return targetBackend;
};

const removeSdkMonitorUserConnection = (sdkMonitorServerPool, userConnId) => {
  const targetBackend = findSdkMonitorConnection(sdkMonitorServerPool, userConnId);
  return targetBackend
    ? { targetBackend, broadcastUsers: sdkMonitorServerPool[targetBackend].broadcastUsers.filter((id) => id !== userConnId) }
    : null;
};

module.exports = {
  createSdkMonitorConnection,
  removeSdkMonitorUserConnection,
};
