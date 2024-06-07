/*
 * @Author: Seven Yaoching-Chi
 * @Date: 2022-11-29 14:31:01
 * @Last Modified by: Seven Yaoching-Chi
 * @Last Modified time: 2024-06-06 22:25:06
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('../config');
const OpenAI = require('openai');
const authMiddleware = require('../middleware/auth');
const { handleAPIError: errorHandler } = require('../helper/errorHandler');
const Conversation = require('../models/conversation')

const openai = new OpenAI({
  apiKey: config.openai_key
})

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const gen_sys_msg = (msg) => ({ role: "system", content: msg })
const gen_assist_msg = (msg) => ({ role: "assistant", content: msg })
const gen_user_msg = (msg) => ({ role: "user", content: msg })
const model = 'gpt-3.5-turbo'

router.get('/conversations', authMiddleware, async (req, res) => {
  if (req.user) {
    const conversations = await Conversation.find({ userId: req.user.id });
    res.status(200).json(conversations)
  }
})

router.get('/conversation/:id', authMiddleware, async (req, res) => {
  console.log(req.params)
  if (req.user && req.params.id) {
    try {
      const conversation = await Conversation.findById(req.params.id);
      console.log(conversation)
      if (conversation) {
        res.status(200).json(JSON.parse(conversation.messages))
      } else {
        res.status(404).json('failed')
      }
    } catch (err) {
      res.status(404).json('failed')
    }
  }
})

router.post('/init', authMiddleware, async (req, res) => {
  const params = req.body;
  if (params?.message && req.user) {
    const {id} = req.user
    const messages = [gen_sys_msg(params.message)]

    const completion = await openai.chat.completions.create({
      messages,
      model
    });
    messages.push(completion.choices[0].message)
    const newConversation = new Conversation({ userId: id, messages: JSON.stringify(messages), createAt: new Date().getTime() });
    await newConversation.save()
    res.status(200).json({conversationId: newConversation._id, messages});
  } else {
    res.status(400).json('failed');
  }
});

router.post('/msg', authMiddleware, async (req, res) => {
  const params = req.body;
  if (req.user && params.prompt && params.conversationId) {
    try {
      const conversation = await Conversation.findById(params.conversationId);
      const messages = JSON.parse(conversation.messages)
      messages.push(gen_user_msg(params.prompt))
      const completion = await openai.chat.completions.create({
        messages,
        model
      });
      messages.push(completion.choices[0].message)
      conversation.messages = JSON.stringify(messages)
      await conversation.save()
      // console.log(messages)
      res.status(200).json(completion.choices[0]);
    } catch (err) {
      res.status(400).json('failed');
    }
  } else {
    res.status(400).json('failed');
  }

});
module.exports = router;
