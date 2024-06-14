const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  messages: { type: String, default: '' },
  persona: { type: String, default: 'Health-Conscious' },
  createAt: { type: Number, default: new Date().getTime() },
});

module.exports = mongoose.model('Conversation', ConversationSchema);
