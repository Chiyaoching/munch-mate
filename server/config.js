/*
 * @Author: Seven Yaoching-Chi 
 * @Date: 2024-05-23 18:49:27 
 * @Last Modified by:   Seven Yaoching-Chi 
 * @Last Modified time: 2024-05-23 18:49:27 
 */

const fs = require('fs');
const path = require('path');
const { argv } = require('yargs');

const httpParam = argv.https || process.env.https;
const isHttps = httpParam ? ((typeof httpParam === 'string' && httpParam === 'true') || httpParam === true) : true; // default: https
const sdkParam = argv.sdkMode || process.env.sdk_mode;
const isSDKMode = ((typeof sdkParam === 'string' && sdkParam === 'true') || sdkParam === true);
const versionFilePath = path.join(__dirname, 'version');
const version = (fs.existsSync(versionFilePath)) && fs.readFileSync(versionFilePath, { encoding: 'utf-8' });

const servicesGroup = (serverIP) => {
  const protocol = isHttps ? 'https' : 'http';
  return {
    restServerUrl: `http://${serverIP}:20020`,
    configServerUrl: `${protocol}://${serverIP}:20005`,
    mediaServerUrl: `${protocol}://${serverIP}:20006`,
    monitorServerUrl: `${protocol}://${serverIP}:20021`,
    tslProxyAPPUrl: `${protocol}://${serverIP}:20062`,
    multiviewServerUrl: `${protocol}://${serverIP}:20073`,
    portalServerUrl: `https://${serverIP}:23035`,
    httpPortalServerUrl: `http://${serverIP}:20035`,
    licenseManagerUrl: `http://${serverIP}:20501`,
  };
};
const config = {
  port: argv.port || process.env.port || 20077,
  https: isHttps,
  SDKMode: sdkParam ? isSDKMode : true,
  version: process.env.next_uigw_version || version || 'dev',
  serverIP: argv.serverIP || process.env.SERVER_IP || 'localhost',
  camAmountLimit: argv.camAmountLimit || process.env.CAM_AMOUNT_LIMIT || 16,
  logPath: argv.logPath || process.env.log_path || process.platform === 'win32' ? 'C:/Logs/sl-uigw' : process.cwd(),
};
module.exports = {
  ...config,
  ...servicesGroup(config.serverIP),
};
