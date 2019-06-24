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
    type: String
  },
  isCompleted: {
    type: Boolean
  },
  purpose: {
    type: String,
    default: 'personal'
  },
  createDate: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('todo', TodoSchema);
