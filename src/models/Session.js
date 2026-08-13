const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clockInTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  clockOutTime: {
    type: Date,
    default: null
  },
  totalHours: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
