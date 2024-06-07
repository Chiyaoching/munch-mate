const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  messages: { type: String, default: '' },
  createAt: { type: Number, default: new Date().valueOf() },
});

module.exports = mongoose.model('Conversation', ConversationSchema);
