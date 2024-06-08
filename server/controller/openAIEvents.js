/*
 * @Author: Seven Yaoching-Chi 
 * @Date: 2024-06-07 14:56:07 
 * @Last Modified by: Seven Yaoching-Chi
 * @Last Modified time: 2024-06-07 16:04:08
 */

const config = require('../config');
const OpenAI = require('openai');

class OpenAIEvents {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.openai = new OpenAI({apiKey})
    this.model = 'gpt-3.5-turbo'
    this.temperature = 0.7
  }

  async createConversation (messages, tools = null, tool_choice = null) {
    try {
      const completion = await this.openai.chat.completions.create({
        messages,
        model: this.model,
        temperature: this.temperature,
        tools,
        tool_choice
      });
      return completion
    } catch (err) {
      return err
    }
  }
}

module.exports = OpenAIEvents