/*
 * @Author: Seven Yaoching-Chi
 * @Date: 2022-12-27 17:24:20
 * @Last Modified by: Seven Yaoching-Chi
 * @Last Modified time: 2023-02-23 17:33:24
 */

const fs = require('fs');
// need to use the cache to solve the orver write issue if we are still using the file system to store data.
// Seven Yaoching-chi 02/23/2023
const CHANNEL_SETTING_FILE_PATH = '.settingFiles/channelSettings';

const getChannelSettings = () => ({ action: 'channelSettings', data: fs.existsSync(CHANNEL_SETTING_FILE_PATH) ? JSON.parse(fs.readFileSync(CHANNEL_SETTING_FILE_PATH, { encoding: 'utf-8' }) || {}) : {} });
const updateChannelSettings = (data) => {
  const existedChannelSettings = getChannelSettings();
  const newChannelSettings = { ...existedChannelSettings?.data, ...data };
  fs.writeFileSync(CHANNEL_SETTING_FILE_PATH, JSON.stringify(newChannelSettings), { encoding: 'utf-8' });
};

module.exports = {
  getChannelSettings,
  updateChannelSettings,
};
