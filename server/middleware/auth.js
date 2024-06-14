const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config')

const cleanUpOpenAIInterface = (userId) => {
  return {...global.currentUsers[userId], openAIInfo: {...global.currentUsers[userId]['openAIInfo'], openai: null}}
}
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Assuming the format is "Bearer <token>"

    // Verify the token
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.log({user})
        // global.currentUsers[user.id] = cleanUpOpenAIInterface(user.id)
        return res.sendStatus(403); // Forbidden
      }
      req.user = user; // Attach the user object to the request
      // init the open info object if it doesn't exist.
      if (!global.currentUsers[user.id]) {
        global.currentUsers = {...global.currentUsers, [user.id]: {email: user.email, openAIInfo: {apiKey: null, openai: null}} }
      }
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

module.exports = authMiddleware;
