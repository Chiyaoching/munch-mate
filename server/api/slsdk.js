/*
 * @Author: Seven Yaoching-Chi
 * @Date: 2022-11-30 14:03:28
 * @Last Modified by: Seven Yaoching-Chi
 * @Last Modified time: 2023-08-29 16:20:54
 */

const express = require('express');

const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const https = require('https');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { handleAPIError: errorHandler } = require('../helper/errorHandler');
const { log, err, warn } = require('../helper/logger');

const infoLog = (...args) => log('[API]', ...args);
const errLog = (...args) => err('[API]', ...args);

const {
  SDKMode, https: isHttps, configServerUrl, mediaServerUrl, multiviewServerUrl, portalServerUrl, licenseManagerUrl, httpPortalServerUrl,
} = config;

const TOKEN_EXPIRE_TIME = 60 * 60 * 1000;

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const verifyServerIP = (req, res, next) => {
  if (req.headers.serverip) {
    req[req.method === 'GET' ? 'query' : 'body'].serverIP = req.headers.serverip;
    next();
  } else {
    res.status(404).json(`[${req.originalUrl}] server ip can't be empty.`);
  }
};

router.get('/localEngines', async (req, res) => {
  let globalEngines = null;
  let localEngines = null;
  let services = null;

  try {
    const result = await axios.get(`${configServerUrl}/v1/engines`);
    localEngines = result?.data;
  } catch (err) {
    errLog('get engines failed: ', err.toString());
  }

  try {
    const result = await axios.get(`${configServerUrl}/v1/servers`);
    services = result?.data;
    global.backendWithSDKServices.local = services;
  } catch (err) {
    errLog('get services failed: ', err.toString());
  }

  try {
    const result = await axios.get(`${configServerUrl}/v1/global/backends`);
    globalEngines = result?.data?.data;
    // filter the global engines by local backend id, so we can have the local backend ip and some info.
    // for support only one backend feature. Seven Yaoching-Chi 01/03/2023
    const localBE = localEngines.find((item) => item.type === 'backend');
    const acceptableEngines = localBE && globalEngines.filter((item) => item.id === localBE.id);
    res.status(200).json({
      local: localEngines, global: globalEngines, acceptableEngines, services,
    });
  } catch (err) {
    errorHandler(res, req, err);
  }
});

router.get('/apps', async (req, res) => {
  try {
    const result = await axios.get(`${configServerUrl}/v1/apps`);
    res.status(200).json(result.data);
  } catch (err) {
    errorHandler(res, req, err);
  }
});

router.get('/localProcessors', async (req, res) => {
  try {
    const result = await axios.get(`${configServerUrl}/v1/processors`);
    res.status(200).json(result.data);
  } catch (err) {
    errorHandler(res, req, err);
  }
});

router.get('/localServices', async (req, res) => {
  try {
    const result = await axios.get(`${configServerUrl}/v1/servers`);
    res.status(200).json(result.data);
  } catch (err) {
    errorHandler(res, req, err);
  }
});

router.post('/sdpAnswer/video', async (req, res) => {
  try {
    const params = req.body;
    const { local } = global.backendWithSDKServices;
    const mediaServer = local && local.find((item) => item.name === 'mediaserver');
    if (!mediaServer) throw new Error('can`t find the media server');
    const {
      publicIp, publicPort, privateIp, privatePort,
    } = mediaServer;
    const url = `${isHttps ? 'https' : 'http'}://${publicIp && publicPort ? `${publicIp}:${publicPort}` : `${privateIp}:${privatePort}`}`;
    const result = await axios.post(`${SDKMode ? url : mediaServerUrl}/v1/webrtc/offer/video`, params);
    res.status(200).json(result.data);
  } catch (err) {
    errorHandler(res, req, err);
  }
});

router.post('/sdpAnswer/audio', async (req, res) => {
  try {
    const params = req.body;
    const { local } = global.backendWithSDKServices;
    const mediaServer = local && local.find((item) => item.name === 'mediaserver');
    if (!mediaServer) throw new Error('can`t find the media server');
    const {
      publicIp, publicPort, privateIp, privatePort,
    } = mediaServer;
    const url = `${isHttps ? 'https' : 'http'}://${publicIp && publicPort ? `${publicIp}:${publicPort}` : `${privateIp}:${privatePort}`}`;
    const result = await axios.post(`${SDKMode ? url : mediaServerUrl}/v1/webrtc/offer/audio`, params);
    res.status(200).json(result.data);
  } catch (err) {
    errorHandler(res, req, err);
  }
});

router.post('/audio/register', async (req, res) => {
  try {
    const params = req.body;
    const { local } = global.backendWithSDKServices;
    const mediaServer = local && local.find((item) => item.name === 'mediaserver');
    if (!mediaServer) throw new Error('can`t find the media server');
    const {
      publicIp, publicPort, privateIp, privatePort,
    } = mediaServer;
    const url = `${isHttps ? 'https' : 'http'}://${publicIp && publicPort ? `${publicIp}:${publicPort}` : `${privateIp}:${privatePort}`}`;
    const result = await axios.post(`${SDKMode ? url : mediaServerUrl}/v1/webrtc/registeraudio`, params);
    res.status(200).json(result.data);
  } catch (err) {
    errorHandler(res, req, err);
  }
});

router.get('/bitc', async (req, res) => {
  try {
    const params = req.query;
    const { local } = global.backendWithSDKServices;
    const multiviewServer = local && local.find((item) => item.name === 'multiviewserver');
    if (!multiviewServer) throw new Error('can`t find the multiview server');
    const {
      publicIp, publicPort, privateIp, privatePort,
    } = multiviewServer;
    // for web page to replace the ip address by window.location.hostname.
    const url = `${isHttps ? 'https' : 'http'}://replace_by_hostname:${privatePort}`;
    // const url = `${isHttps ? 'https' : 'http'}://${publicIp && publicPort ? `${publicIp}:${publicPort}` : `${privateIp}:${privatePort}`}`;
    const BITCURL = `${SDKMode ? url : multiviewServerUrl}/framed/backend/${params?.backendId}/channelId/${params?.channelId}?video=false`;
    res.status(200).json(BITCURL);
  } catch (err) {
    errorHandler(res, req, err);
  }
});

router.get('/video', async (req, res) => {
  try {
    const params = req.query;
    const { local } = global.backendWithSDKServices;
    const multiviewServer = local && local.find((item) => item.name === 'multiviewserver');
    if (!multiviewServer) throw new Error('can`t find the multiview server');
    const {
      publicIp, publicPort, privateIp, privatePort,
    } = multiviewServer;
    // for web page to replace the ip address by window.location.hostname.
    const url = `${isHttps ? 'https' : 'http'}://replace_by_hostname:${privatePort}`;
    const borderColor = global.videoBorderColors[params?.channelId] || false;
    let URLParams = `none/${params?.channelId}?border=false`;
    switch (params?.mode) {
      case 'videoWithBITC':
        URLParams = `video/${params?.channelId}?color=${borderColor}&border=${borderColor}`;
        break;
      case 'videoWithInfo':
        URLParams = `light/${params?.channelId}?color=${borderColor}&border=false`;
        break;
      default:
        break;
    }

    if (params?.vuMeter) {
      URLParams += '&vueMeter=true';
    }
    const videoURL = `${SDKMode ? url : multiviewServerUrl}/framed/backend/${params?.backendId}/${URLParams}`;
    res.status(200).json(videoURL);
  } catch (err) {
    errorHandler(res, req, err);
  }
});

router.get('/multiviewers', async (req, res) => {
  try {
    const result = await axios.get(`${portalServerUrl}/api/subweblinks`);
    res.status(200).json(result.data);
  } catch (err) {
    errorHandler(res, req, err);
  }
});

router.delete('/multiviewer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await axios.delete(`${portalServerUrl}/api/subweblinks/${id}`);
    res.status(200).json(result.data);
  } catch (err) {
    errorHandler(res, req, err);
  }
});

router.post('/multiviewer', async (req, res) => {
  try {
    const { appId, ...params } = req.body;
    const SDKFormat = {
      type: 'UIGW_MVW',
      connectionRules: params?.inWaitingRoom ? 'Waiting room' : 'Open',
      enable: true,
      appId,
      data: {
        layout: { createTime: new Date().valueOf(), ...params },
      },
    };
    const result = await axios.post(`${portalServerUrl}/api/subweblinks`, SDKFormat);
    res.status(200).json(result.data);
  } catch (err) {
    errorHandler(res, req, err);
  }
});

router.put('/multiviewer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { appId, ...params } = req.body;
    const SDKFormat = {
      connectionRules: params?.inWaitingRoom ? 'Waiting room' : 'Open',
      enable: true,
      // appId,
      data: {
        layout: { ...params },
      },
    };
    const result = await axios.put(`${portalServerUrl}/api/subweblinks/${id}`, SDKFormat);
    res.status(200).json(result.data);
  } catch (err) {
    errorHandler(res, req, err);
  }
});

router.get('/info', async (req, res) => {
  try {
    const result = await axios.get(`${portalServerUrl}/api/infos`);
    res.status(200).json(result.data);
  } catch (err) {
    errorHandler(res, req, err);
  }
});

router.get('/license', async (req, res) => {
  try {
    const result = await axios.get(`${licenseManagerUrl}/License`);
    res.status(200).json(result.data);
  } catch (err) {
    errorHandler(res, req, err);
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { pw } = req.body;
    console.log(pw);
    const result = await axios.post(`${httpPortalServerUrl}/api/auth/setup/login`, { password: pw });
    const token = jwt.sign({ exp: TOKEN_EXPIRE_TIME, data: result.data }, 'simplylive');
    res.cookie('token', token, { maxAge: TOKEN_EXPIRE_TIME, httpOnly: false });
    res.status(200).json(token);
  } catch (err) {
    errorHandler(res, req, err);
  }
});

module.exports = router;
