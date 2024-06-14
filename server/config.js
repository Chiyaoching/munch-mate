/*
 * @Author: Seven Yaoching-Chi 
 * @Date: 2024-06-06 15:46:41 
 * @Last Modified by: Seven Yaoching-Chi
 * @Last Modified time: 2024-06-13 16:53:53
 */

const fs = require('fs');
const path = require('path');
const { argv } = require('yargs');

const httpParam = argv.https || process.env.https;
const isHttps = httpParam ? ((typeof httpParam === 'string' && httpParam === 'true') || httpParam === true) : true; // default: https
const versionFilePath = path.join(__dirname, 'version');
const version = (fs.existsSync(versionFilePath)) && fs.readFileSync(versionFilePath, { encoding: 'utf-8' });

const config = {
  port: argv.port || process.env.port || 20077,
  openai_key: argv.openai_key || process.env.openai_key || '',
  openai_model: argv.openai_model || process.env.openai_model || 'gpt-4o',
  pinecone_key: argv.pinecone_key || process.env.pinecone_key || '',
  pinecone_index: argv.pinecone_index || process.env.pinecone_index || '',
  pinecone_namespace: argv.pinecone_namespace || process.env.pinecone_namespace || '',
  mongo_url: argv.mongo_url || process.env.mongo_url || '',
  JWT_SECRET: 'cstu-gpt-application-class-project-munchmate-key',
  https: isHttps,
  version: process.env.next_uigw_version || version || 'dev',
  logPath: argv.logPath || process.env.log_path || process.cwd(),
};
module.exports = {
  ...config,
};
