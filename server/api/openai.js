/*
 * @Author: Seven Yaoching-Chi
 * @Date: 2022-11-29 14:31:01
 * @Last Modified by: Seven Yaoching-Chi
 * @Last Modified time: 2024-06-14 22:19:23
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const openaiMiddleware = require('../middleware/openai');
const Conversation = require('../models/conversation')
const {TOOLS, SYS_CONTENTS, PERSONAS} = require('../constant/constants');

const gen_sys_msg = (msg) => ({ role: "system", content: msg })
const gen_assist_msg = (msg, isFunctionCall=false) => ({ role: "assistant", content: msg, isFunctionCall })
const gen_user_msg = (msg) => ({ role: "user", content: msg })

const handleFunctionCall = async (openai, responseMsg, user) => {
  const funcCallMsgs = openai.functionCall(responseMsg)
  // handle the async function call for the results.
  const allMsgs = await Promise.all(funcCallMsgs.map(res => res.content))
  for (let i = 0; i < funcCallMsgs.length; i++) {
    funcCallMsgs[i].content = allMsgs[i]
  }
  console.log({user, funcCallMsgs})
  return funcCallMsgs
}

router.get('/conversations', authMiddleware, async (req, res) => {
  if (req.user) {
    const conversations = await Conversation.find({ userId: req.user.id });
    res.status(200).json(conversations.map(item => ({...item._doc, messages: ''})))
  }
})

router.get('/conversation/:id', authMiddleware, async (req, res) => {
  if (req.user && req.params.id) {
    try {
      const conversation = await Conversation.findById(req.params.id);
      if (conversation) {
        res.status(200).json(JSON.parse(conversation.messages).filter(message => message.content && message.role !== 'tool'))
      } else {
        res.status(404).json('failed')
      }
    } catch (err) {
      res.status(404).json('failed')
    }
  }
})

router.post('/init', authMiddleware, openaiMiddleware, async (req, res) => {
  const params = req.body;
  if (!isNaN(params.sysContentIndex) && !isNaN(params.personaTypeIndex) && req.user) {
    const {id} = req.user
    let messages = [gen_sys_msg(SYS_CONTENTS[params.sysContentIndex] + PERSONAS[params.personaTypeIndex].content)]
    const openai = global.currentUsers[id].openAIInfo.openai
    try {
      let completion = await openai.createConversation(messages, TOOLS, 'auto')
      let responseMsg = completion.choices[0].message

      if (responseMsg.tool_calls) {
        messages.push(responseMsg)
        const funcCallMsgs = await handleFunctionCall(openai, responseMsg, req.user)
        messages = [...messages, ...funcCallMsgs]
        completion = await openai.createConversation(messages)
        responseMsg = gen_assist_msg(completion.choices[0].message.content, true)
      }

      messages.push(responseMsg)

      const newConversation = new Conversation({ userId: id, messages: JSON.stringify(messages), persona: PERSONAS[params.personaTypeIndex].name, createAt: new Date().getTime() });
      await newConversation.save()
      
      res.status(200).json(newConversation);
    } catch (err) {
      res.status(400).json('openAI API failed.');
    }
  } else {
    res.status(400).json('failed');
  }
});

router.post('/msg', authMiddleware, openaiMiddleware, async (req, res) => {
  const params = req.body;
  if (req.user && params.prompt && params.conversationId) {
    try {
      const conversation = await Conversation.findById(params.conversationId);

      let messages = JSON.parse(conversation.messages)
      messages.push(gen_user_msg(params.prompt))

      const openai = global.currentUsers[req.user.id].openAIInfo.openai
      let completion = await openai.createConversation(messages, TOOLS, 'auto')
      
      let responseMsg = completion.choices[0].message
      if (responseMsg.tool_calls) {
        const funcCallMsgs = await handleFunctionCall(openai, responseMsg, req.user)
        messages.push(responseMsg)
        messages = [...messages, ...funcCallMsgs]
        completion = await openai.createConversation(messages)
        responseMsg = gen_assist_msg(completion.choices[0].message.content, true)
      }

      messages.push(responseMsg)

      conversation.messages = JSON.stringify(messages)
      await conversation.save()

      res.status(200).json(responseMsg);
    } catch (err) {
      res.status(400).json(err.toString());
    }
  } else {
    res.status(400).json('failed');
  }

});

module.exports = router;
