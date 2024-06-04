const { getChannelSettings, updateChannelSettings } = require('./channelSetting');
const {
  getMultiviewerSettings, addMultiviewerSettings, updateMultiviewerSettings, deleteMultiviewerSettings,
} = require('./multiviewerSetting');
const { createSdkMonitorConnection, removeSdkMonitorUserConnection } = require('./sdkMonitorEvents');

module.exports = {
  getChannelSettings,
  updateChannelSettings,
  getMultiviewerSettings,
  addMultiviewerSettings,
  updateMultiviewerSettings,
  deleteMultiviewerSettings,
  createSdkMonitorConnection,
  removeSdkMonitorUserConnection,
};
