/*
 * @Author: Seven Yaoching-Chi
 * @Date: 2022-11-29 14:31:01
 * @Last Modified by: Seven Yaoching-Chi
 * @Last Modified time: 2022-11-29 14:34:13
 */

const express = require('express');

const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const { version } = config;
const { handleAPIError: errorHandler } = require('../helper/errorHandler');

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

router.get('/env', (req, res) => {
  res.status(200)
    .json({
      ...config,
    });
});

router.get('/heartbeat', (req, res) => {
  try {
    if (!version) throw new Error('version not found.');
    res.status(200).json({ version });
  } catch (err) {
    errorHandler(res, req, err);
  }
});

module.exports = router;
