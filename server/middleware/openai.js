const OpenAIEvents = require('../controller/openAIEvents')
const User = require('../models/user');

const openaiMiddleware = async (req, res, next) => {
  if (req?.user?.id) {
    const userId = req.user.id
    const userInfo = global.currentUsers[userId]
    if (!userInfo) {
      global.currentUsers = {...global.currentUsers, [userId]: {email: req.user.email, openAIInfo: {apiKey: null, openai: null}} }
    }
    let cacheApiKey = global.currentUsers[userId].openAIInfo?.apiKey
    let cacheOpenai = global.currentUsers[userId].openAIInfo?.cacheOpenai

    if (!cacheApiKey) {
      console.log('looking up API key in DB...')
      const user = await User.findOne({ email: req.user.email });
      if (user.apiKey) {
        cacheApiKey = user.apiKey
      }
    }
    
    if (cacheApiKey && !cacheOpenai) {
      const openai = new OpenAIEvents(cacheApiKey)
      global.currentUsers = {...global.currentUsers, [userId]: {...userInfo, openAIInfo: {apiKey: cacheApiKey, openai}}}
      next();
    } else if (!cacheApiKey) {
      res.status(404).json('OpenAI API auth failed, please check the key first')
    }
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

module.exports = openaiMiddleware;
