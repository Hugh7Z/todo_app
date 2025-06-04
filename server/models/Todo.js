const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    trim: true
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Todo', todoSchema); 