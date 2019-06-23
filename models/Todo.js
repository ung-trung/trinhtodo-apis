const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  header: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isCompleted: {
    type: String
  },
  purpose: {
    type: String,
    default: 'personal'
  }
});

module.exports = mongoose.model('todo', TodoSchema);
