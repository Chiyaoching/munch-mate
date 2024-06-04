/*
 * @Author: Seven Yaoching-Chi
 * @Date: 2022-12-13 14:23:15
 * @Last Modified by: Seven Yaoching-Chi
 * @Last Modified time: 2023-04-12 13:43:23
 */

const express = require('express');

const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const { handleAPIError: errorHandler } = require('../helper/errorHandler');
const { log, err, warn } = require('../helper/logger');

const infoLog = (...args) => log('[API]', ...args);
const errLog = (...args) => err('[API]', ...args);

const proxyBackendResetServers = {};

const {
  camAmountLimit, monitorServerUrl,
} = config;

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

function convertFormat(format) {
  // ;FP_FORMAT_UNKNOWN = 0,
  // ;FP_FORMAT_1080i_5000 = 1,
  // ;FP_FORMAT_1080i_5994 = 2,
  // ;FP_FORMAT_1080i_6000 = 3,
  // ;FP_FORMAT_1080p_2500 = 4,
  // ;FP_FORMAT_1080p_2997 = 5,
  // ;FP_FORMAT_1080p_3000 = 6,
  // ;FP_FORMAT_1080p_5000 = 7,
  // ;FP_FORMAT_1080p_5994 = 8,
  // ;FP_FORMAT_1080p_6000 = 9,
  // ;FP_FORMAT_720p_2500 = 10,
  // ;FP_FORMAT_720p_2997 = 11,
  // ;FP_FORMAT_720p_5000 = 12,
  // ;FP_FORMAT_720p_5994 = 13,
  // ;FP_FORMAT_720p_6000 = 14,
  // ;FP_FORMAT_4Kp_2500 = 15,
  // ;FP_FORMAT_4Kp_2997 = 16,
  // ;FP_FORMAT_4Kp_3000 = 17,
  // ;FP_FORMAT_4Kp_5000 = 18,
  // ;FP_FORMAT_4Kp_5994 = 19,
  // ;FP_FORMAT_4Kp_6000 = 20,
  // ;FP_FORMAT_1080p_2400 = 21,
  // ;FP_FORMAT_4Kp_2400 = 22,

  const formatOptions = {
    FP_FORMAT_UNKNOWN: { framerate: null, resolution: null },
    FP_FORMAT_1080i_5000: { framerate: 25, resolution: '1080i' },
    FP_FORMAT_1080i_5994: { framerate: 29.97, resolution: '1080i' },
    FP_FORMAT_1080i_6000: { framerate: 30, resolution: '1080i' },
    FP_FORMAT_1080p_2500: { framerate: 25, resolution: '1080p' },
    FP_FORMAT_1080p_2997: { framerate: 29.97, resolution: '1080p' },
    FP_FORMAT_1080p_3000: { framerate: 30, resolution: '1080p' },
    FP_FORMAT_1080p_5000: { framerate: 50, resolution: '1080p' },
    FP_FORMAT_1080p_5994: { framerate: 59.94, resolution: '1080p' },
    FP_FORMAT_1080p_6000: { framerate: 60, resolution: '1080p' },
    FP_FORMAT_720p_2500: { framerate: 25, resolution: '720p' },
    FP_FORMAT_720p_2997: { framerate: 29.97, resolution: '720p' },
    FP_FORMAT_720p_5000: { framerate: 50, resolution: '720p' },
    FP_FORMAT_720p_5994: { framerate: 59.94, resolution: '720p' },
    FP_FORMAT_720p_6000: { framerate: 60, resolution: '720p' },
    FP_FORMAT_4Kp_2500: { framerate: 25, resolution: '4Kp' },
    FP_FORMAT_4Kp_2997: { framerate: 29.97, resolution: '4Kp' },
    FP_FORMAT_4Kp_3000: { framerate: 30, resolution: '4Kp' },
    FP_FORMAT_4Kp_5000: { framerate: 50, resolution: '4Kp' },
    FP_FORMAT_4Kp_5994: { framerate: 59.94, resolution: '4Kp' },
    FP_FORMAT_4Kp_6000: { framerate: 60, resolution: '4Kp' },
    FP_FORMAT_1080p_2400: { framerate: 24, resolution: '1080p' },
    FP_FORMAT_4Kp_2400: { framerate: 24, resolution: '4Kp' },
  };

  return formatOptions[Object.keys(formatOptions).find((key, index) => index === parseInt(format, 10))];
}

function convertSize(size) {
  // ;thumbnail_480x270   = 0,
  // ;thumbnail_960x540   = 1,
  // ;thumbnail_full_size  = 2,

  const sizeOptions = {
    thumbnail_480x270: '480x270',
    thumbnail_960x540: '960x540',
    thumbnail_full_size: '1920x1080',
  };
  return sizeOptions[Object.keys(sizeOptions).find((key, index) => index === parseInt(size, 10))];
}

router.get('/configs/local', async (req, res) => {
  try {
    const { backendId } = req.query;
    const versions = JSON.parse(JSON.stringify((await axios.get(`${monitorServerUrl}/v1/backends/${backendId}/versions`)).data)).data || {};
    const configs = JSON.parse(JSON.stringify((await axios.get(`${monitorServerUrl}/v1/backends/${backendId}/videoconfig`)).data)).data || {};
    const audioConfigs = JSON.parse(JSON.stringify((await axios.get(`${monitorServerUrl}/v1/backends/${backendId}/audioconfig`)).data)).data || {};
    const cameraResult = JSON.parse(JSON.stringify((await axios.get(`${monitorServerUrl}/v1/backends/${backendId}/videoconfig/cams`)).data))?.data;
    const cameraNames = cameraResult ? cameraResult.filter((item) => item.name).reduce((all, item) => {
      all[item.index - 1] = item.name;
      return all;
    }, {}) : {};

    const audioOutputkeys = [
      'CONS_PGM_1_CLEAN',
      'CONS_PGM_1_DIRTY',
      'CONS_PGM_2_CLEAN',
      'CONS_PGM_2_DIRTY',
      'CONS_PGM_3_CLEAN',
      'CONS_PGM_3_DIRTY',
      'CONS_PGM_4_CLEAN',
      'CONS_PGM_4_DIRTY',
      'CONS_PGM_5_CLEAN',
      'CONS_PGM_5_DIRTY',
      'CONS_PGM_6_CLEAN',
      'CONS_PGM_6_DIRTY',
      'CONS_PGM_7_CLEAN',
      'CONS_PGM_7_DIRTY',
      'CONS_PGM_8_CLEAN',
      'CONS_PGM_8_DIRTY',
      'CONS_AUX_1',
      'CONS_AUX_2',
      'CONS_CONTROL_VISION',
    ];
    const audioAliasList = audioConfigs?.aliasTable?.aliasList.map((item) => ({ alias: item.alias, type: item.prov.type, monoId: item.prov.monoID }));
    const tmpAudioConfigs = {
      outputList: {},
      aliasList: audioAliasList,
    };
    let keyCounter = 0;
    if (audioConfigs?.outputTable) {
      audioConfigs?.outputTable?.outputConsList.forEach((item, index) => {
        if (index !== 0 && index % 16 === 0) {
          keyCounter += 1;
        }
        if (!tmpAudioConfigs.outputList[audioOutputkeys[keyCounter]]) tmpAudioConfigs.outputList[audioOutputkeys[keyCounter]] = [];
        const aliasObj = audioAliasList && audioAliasList.find((obj) => obj.type === item.type && obj.monoId === item.monoID);
        if (aliasObj) item.alias = aliasObj.alias;
        tmpAudioConfigs.outputList[audioOutputkeys[keyCounter]].push(item);
      });
    }

    const tmpConfigs = {
      cameras: {},
      TSLSettings: {},
      playoutSettings: {},
      generalSettings: {},
      layersSettings: {},
      networkFuncSettings: {},
      serversInfo: {},
      GPI: {},
      GPO: {},
      rPGM: {},
    };
    Object.keys(configs).forEach((key) => {
      if (key.indexOf('Video_Format') >= 0) {
        tmpConfigs.videoFormat = convertFormat(configs.Video_Format || configs.GENERAL_CONFIG_Video_Format);
      } else if (key.indexOf('ReplayThumbnailResolution') >= 0) {
        tmpConfigs.replayResolution = convertSize(configs.ReplayThumbnailResolution || configs.GENERAL_CONFIG_ReplayThumbnailResolution);
      } else if (key.indexOf('PGMPRVThumbnailResolution') >= 0) {
        tmpConfigs.PGMPRVResolution = convertSize(configs.PGMPRVThumbnailResolution || configs.GENERAL_CONFIG_PGMPRVThumbnailResolution);
      } else if (key.indexOf('CAMERA_CONFIG_') === 0) {
        if (/CAMERA_CONFIG_Cam(\d{1,3})/g.test(key)) {
          const camIndex = key.substring('CAMERA_CONFIG_Cam'.length, key.length).split('_')[0];
          if (camIndex <= camAmountLimit) {
            if (!tmpConfigs.cameras[`Cam${camIndex}`]) tmpConfigs.cameras[`Cam${camIndex}`] = {};
            tmpConfigs.cameras[`Cam${camIndex}`][key] = configs[key];
          }
        } else {
          tmpConfigs.cameras[key] = configs[key];
        }
      } else if (key.indexOf('TSL_') === 0) {
        if (/TSL_CAM/g.test(key)) {
          const tslIndex = key.substring('TSL_CAM'.length, key.length).split('_')[0];
          if (tslIndex <= camAmountLimit) {
            tmpConfigs.TSLSettings[key] = configs[key];
          }
        } else {
          tmpConfigs.TSLSettings[key] = configs[key];
        }
      } else if (key.indexOf('Playout_') === 0) {
        const playoutIndex = key.substring('Playout_'.length, key.length).split('_')[0];
        if (playoutIndex <= camAmountLimit) {
          if (!tmpConfigs.playoutSettings[`Playout_${playoutIndex}`]) tmpConfigs.playoutSettings[`Playout_${playoutIndex}`] = {};
          tmpConfigs.playoutSettings[`Playout_${playoutIndex}`][key] = configs[key];
        }
      } else if (key.indexOf('GENERAL_CONFIG_') === 0) {
        tmpConfigs.generalSettings[key] = configs[key];
      } else if (key.indexOf('LAYERS_') === 0) {
        tmpConfigs.layersSettings[key] = configs[key];
      } else if (key.indexOf('NetworkFunction_') === 0) {
        tmpConfigs.networkFuncSettings[key] = configs[key];
      } else if (/SERVER(\d{1,3})_/g.test(key)) {
        const serverKey = key.substring(0, key.indexOf('_'));
        if (!tmpConfigs.serversInfo[serverKey]) tmpConfigs.serversInfo[serverKey] = {};
        tmpConfigs.serversInfo[serverKey][key.substring(key.indexOf('_') + 1).toLocaleLowerCase()] = configs[key];
      } else if (key.indexOf('GPI') === 0) {
        tmpConfigs.GPI[key] = configs[key];
      } else if (key.indexOf('GPO') === 0) {
        tmpConfigs.GPO[key] = configs[key];
      } else if (key.indexOf('rPGM') === 0) {
        tmpConfigs.rPGM[key.split('_')[0]] = configs[key];
      } else {
        tmpConfigs[key] = configs[key];
      }
    });

    res.status(200).json({
      version: versions.backend || 'unknown', backendId, configs: tmpConfigs, cameraNames, audioConfigs: tmpAudioConfigs,
    });
  } catch (err) {
    errorHandler(res, req, err);
  }
});

module.exports = router;
