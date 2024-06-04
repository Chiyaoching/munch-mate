/*
 * @Author: Seven Yaoching-Chi
 * @Date: 2022-12-27 17:24:20
 * @Last Modified by: Seven Yaoching-Chi
 * @Last Modified time: 2022-12-28 16:45:11
 */

const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const MULTIVIEWER_SETTING_FILE_PATH = '.settingFiles/multiviewerSettings';

const getMultiviewerSettings = () => ({ action: 'multiviewerSettings', data: fs.existsSync(MULTIVIEWER_SETTING_FILE_PATH) ? JSON.parse(fs.readFileSync(MULTIVIEWER_SETTING_FILE_PATH, { encoding: 'utf-8' }) || []) : [] });
const addMultiviewer = (params) => {
  const { data: allMultiviewers } = getMultiviewerSettings();
  const UUID = uuidv4();
  return allMultiviewers.concat({ id: UUID, createTime: new Date().valueOf(), ...params });
};
const updateMultiviewer = (params) => {
  const { id } = params;
  const { data: allMultiviewers } = getMultiviewerSettings();
  const targetIndex = allMultiviewers.findIndex((item) => item.id === id);
  return [
    ...allMultiviewers.slice(0, targetIndex),
    { ...allMultiviewers[targetIndex], ...params },
    ...allMultiviewers.slice(targetIndex + 1, allMultiviewers.length)];
};
const deleteMultiviewer = (params) => {
  const { id } = params;
  const { data: allMultiviewers } = getMultiviewerSettings();

  return allMultiviewers.filter((item) => item.id !== id);
};

const addMultiviewerSettings = (data) => fs.writeFileSync(MULTIVIEWER_SETTING_FILE_PATH, JSON.stringify(addMultiviewer(data)), { encoding: 'utf-8' });
const updateMultiviewerSettings = (data) => fs.writeFileSync(MULTIVIEWER_SETTING_FILE_PATH, JSON.stringify(updateMultiviewer(data)), { encoding: 'utf-8' });
const deleteMultiviewerSettings = (data) => fs.writeFileSync(MULTIVIEWER_SETTING_FILE_PATH, JSON.stringify(deleteMultiviewer(data)), { encoding: 'utf-8' });

module.exports = {
  getMultiviewerSettings,
  addMultiviewerSettings,
  updateMultiviewerSettings,
  deleteMultiviewerSettings,
};
