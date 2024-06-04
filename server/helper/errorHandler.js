/*
 * @Author: Seven Yaoching-Chi
 * @Date: 2022-11-29 15:00:40
 * @Last Modified by: Seven Yaoching-Chi
 * @Last Modified time: 2022-12-15 17:23:14
 */
const { err } = require('./logger');

const errLog = (...args) => err('[API]', ...args);

module.exports = {
  handleAPIError(res, req, err) {
    const errMsg = err.response?.statusText || err.toString();
    errLog(`${err.response?.status}: ${errMsg}`);
    res
      .status(err.response?.status || 400)
      .json({
        path: req.originalUrl,
        message: errMsg,
      });
  },
};
