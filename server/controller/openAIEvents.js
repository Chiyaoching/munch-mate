/*
 * @Author: Seven Yaoching-Chi 
 * @Date: 2024-06-07 14:56:07 
 * @Last Modified by: Seven Yaoching-Chi
 * @Last Modified time: 2024-06-13 16:54:21
 */

const {openai_model, pinecone_key, pinecone_namespace, pinecone_index} = require('../config');
const OpenAI = require('openai');
const {RESTAURANTS} = require('../constant/constants')
const PineconeEvents = require('./pineconeEvents')

class OpenAIEvents {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.openai = new OpenAI({apiKey})
    this.model = openai_model
    this.embeddingModel = 'text-embedding-3-small'
    this.temperature = 0
    this.availableFunctions = {
      "getRestaurants": this.getRestaurants.bind(this),
      "makeReservation": this.makeReservation.bind(this),
      "knowledgeBase": this.knowledgeBase.bind(this)
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
      return Promise.reject(new Error(err));
    }
  }

  async embeddingQuery (query) {
    try {
      const res = await this.openai.embeddings.create({
        input: JSON.stringify(query),
        model: this.embeddingModel
      })
      return res.data[0].embedding
    } catch (err) {
      return Promise.reject(new Error(err));
    }
  }

  functionCall (responseMsg) {
    const toolCalls = responseMsg.tool_calls
    console.log('do function call', toolCalls)
    // const events = []
    const result = []
    for (const toolCall of toolCalls) {

      const functionName = toolCall.function.name
      const functionArgs = JSON.parse(toolCall.function.arguments)

      const func = this.availableFunctions[functionName]

      const res = func({...functionArgs})
      result.push({
          "tool_call_id": toolCall.id,
          "role": "tool",
          "name": functionName,
          "content": res,
      })
    }
    return result
  }

  async getRestaurants ({location, type}) {
    const locationLowerCase = location.toLowerCase()
    const list = RESTAURANTS[locationLowerCase] || []
    const restaurants = type ? list.filter(item => item.type === type.toUpperCase()) : list
    // verify the result, if no result we look for the knowledge base.
    console.log(restaurants)
    if (restaurants.length === 0) {
      const res = await this.knowledgeBase({location, cuisine: type})
      return res
    } else {
      return JSON.stringify({
        location,
        restaurants
      })
    }
  }

  makeReservation ({restaurantName, date, time, partySize}) {
    return JSON.stringify({
      "restaurantName": restaurantName,
      "date": date,
      "time": time,
      "partySize": partySize,
      "confirmation_number": "ABC123456",
      "status": "Confirmed",
    })
  }

  async knowledgeBase ({location, cuisine}) {
    console.log('cheching for knowledge base...')
    const pc = new PineconeEvents(pinecone_key, pinecone_namespace, pinecone_index)
    const queryMsg = {role: 'user', content: `find the restaurants at ${location}${cuisine ? ` with the ${cuisine} cuisine type` : ''}.`}
    const xq = await this.embeddingQuery(queryMsg)
    const res = await pc.queryDB({query: xq, topK: 5})
    const contexts = res['matches'].filter(item => item.score > 0.2).map(item => item.metadata.text)
    // console.log(res, contexts)
    let prompt = ''
    const delimiter = '###'
    let count = 0
    const limit = 3600
    while (count < contexts.length && prompt.length + contexts[count].length < limit) {
      prompt += contexts[count]
      count += 1 
    }

    prompt = delimiter + prompt + delimiter
    return JSON.stringify([
      {role: 'system',content: prompt}, 
      queryMsg
    ])
  }
}

module.exports = OpenAIEvents