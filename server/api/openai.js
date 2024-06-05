/*
 * @Author: Seven Yaoching-Chi
 * @Date: 2022-11-29 14:31:01
 * @Last Modified by: Seven Yaoching-Chi
 * @Last Modified time: 2024-06-04 20:40:27
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const OpenAI = require('openai');

const { handleAPIError: errorHandler } = require('../helper/errorHandler');

const openai = new OpenAI({
  apiKey: config.openai_key
})

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

let messages = []

const gen_sys_msg = (msg) => ({ role: "system", content: msg })
const gen_assist_msg = (msg) => ({ role: "assistant", content: msg })
const gen_user_msg = (msg) => ({ role: "user", content: msg })
const model = 'gpt-3.5-turbo'

const users = [
  {uid: 'a12345', name: 'Seven', email: 'yaochingchi@cstu.edu'}
]

router.get('/users', (req, res) => {
  res.status(200).json(users);
})

router.post('/init', async (req, res) => {
  const params = req.body;
  if (params?.message) {
    messages = [gen_sys_msg(params.message)]
    const completion = await openai.chat.completions.create({
      messages,
      model
    });
    messages.push(completion.choices[0].message)
    res.status(200).json(completion.choices[0]);
  } else {
    res.status(400).json('failed');
  }
});

router.post('/msg', async (req, res) => {
  const params = req.body;
  if (params?.message) {
    messages.push(gen_user_msg(params.message))
    const completion = await openai.chat.completions.create({
      messages,
      model
    });
    messages.push(completion.choices[0].message)
    console.log(messages)
    res.status(200).json(completion.choices[0]);
  } else {
    res.status(400).json('failed');
  }

});
module.exports = router;
