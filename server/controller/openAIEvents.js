/*
 * @Author: Seven Yaoching-Chi 
 * @Date: 2024-06-07 14:56:07 
 * @Last Modified by: Seven Yaoching-Chi
 * @Last Modified time: 2024-06-07 23:32:44
 */

const config = require('../config');
const OpenAI = require('openai');
const {RESTAURANTS} = require('../constant/constants')

class OpenAIEvents {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.openai = new OpenAI({apiKey})
    // this.model = 'gpt-4o'
    this.model = 'gpt-3.5-turbo'
    this.temperature = 0.7
    this.availableFunctions = {
      "getRestaurants": this.getRestaurants
    }
  }

  async createConversation (messages, tools = null, tool_choice = null) {
    try {
      const completion = await this.openai.chat.completions.create({
        messages,
        model: this.model,
        temperature: this.temperature,
        tools: tools,
        tool_choice: tool_choice
      });
      return completion
    } catch (err) {
      return err
    }
  }

  functionCall (responseMsg) {
    const toolCalls = responseMsg.tool_calls
    console.log('do function call', toolCalls)
    const result = []
    for (const toolCall of toolCalls) {

      const functionName = toolCall.function.name
      const functionArgs = JSON.parse(toolCall.function.arguments)

      const func = this.availableFunctions[functionName]

      const res = func(functionArgs.location, functionArgs.type)
      result.push({
          "tool_call_id": toolCall.id,
          "role": "tool",
          "name": functionName,
          "content": res,
      })
    }
    return result
  }

  getRestaurants (location, type) {
    const locationLowerCase = location.toLowerCase()
    const list = RESTAURANTS[locationLowerCase] || []
    return JSON.stringify({
      location,
      restaurants: type ? list.filter(item => item.type === type.toUpperCase()) : list
    })
  }

}

module.exports = OpenAIEvents