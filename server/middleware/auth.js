const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config')
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Assuming the format is "Bearer <token>"

    // Verify the token
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.user = user; // Attach the user object to the request
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

module.exports = authMiddleware;
