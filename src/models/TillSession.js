const mongoose = require('mongoose');

const tillSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  openedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  closedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  openedAt: {
    type: Date,
    required: true
  },
  closedAt: {
    type: Date,
    default: null
  },
  startingFloat: {
    type: Number,
    required: true,
    default: 0
  },
  cashDrop: {
    type: Number,
    default: 0
  },
  cashAdded: {
    type: Number,
    default: 0
  },
  expectedCash: {
    type: Number,
    default: 0
  },
  actualCash: {
    type: Number,
    default: 0
  },
  discrepancy: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open'
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('TillSession', tillSessionSchema);
