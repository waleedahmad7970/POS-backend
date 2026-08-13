const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  attendanceId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeId: {
    type: String,
    required: true
  },
  clockIn: {
    type: Date,
    required: true
  },
  clockOut: {
    type: Date
  },
  totalHours: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Clocked In', 'Completed'],
    default: 'Clocked In'
  },
  attendanceType: {
    type: String,
    enum: ['Present', 'Late', 'Absent', 'On Leave'],
    default: 'Present'
  }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
