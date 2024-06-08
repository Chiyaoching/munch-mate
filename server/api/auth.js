const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {JWT_SECRET} = require('../config');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    global.currentUsers = {...global.currentUsers, [user._id]: {email: user.email, openAIInfo: {apiKey: user?.apiKey, openai: null}} }
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Settings
router.put('/setting', authMiddleware, async (req, res) => {
  const { apiKey } = req.body;
  if (req.user.id) {
    try {
      const user = await User.findById(req.user.id);
  
      user.apiKey = apiKey;
      await user.save();
      const userInfoCache = global.currentUsers[req.user.id]
      if (userInfoCache) {
        global.currentUsers = {
          ...global.currentUsers, 
          [req.user.id]: {...userInfoCache, openAIInfo: {...userInfoCache['openAIInfo'], apiKey}} }
      }
      res.status(200).json({ message: 'User information updated' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

// Settings
router.get('/setting', authMiddleware, async (req, res) => {
  if (req.user.id) {
    try {
      const user = await User.findById(req.user.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;
