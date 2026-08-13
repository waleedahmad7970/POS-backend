const Attendance = require('../models/Attendance');

// Sync a batch of attendance records from desktop app
exports.syncAttendances = async (req, res) => {
  try {
    const { attendances } = req.body;
    if (!attendances || !Array.isArray(attendances)) {
      return res.status(400).json({ error: 'attendances array is required' });
    }

    const synced = [];
    const errors = [];

    for (const record of attendances) {
      try {
        await Attendance.findOneAndUpdate(
          { attendanceId: record.attendanceId },
          {
            userId: record.userId,
            employeeId: record.employeeId,
            clockIn: record.clockIn,
            clockOut: record.clockOut,
            totalHours: record.totalHours,
            status: record.status,
            attendanceType: record.attendanceType || 'Present'
          },
          { upsert: true, new: true }
        );
        synced.push(record.attendanceId);
      } catch (err) {
        errors.push({ id: record.attendanceId, error: err.message });
      }
    }

    res.json({ message: 'Attendance sync complete', synced, errors });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync attendances', details: error.message });
  }
};

// Get all attendance records (with optional filters)
exports.getAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.find().populate('userId', 'name employeeId role').sort({ clockIn: -1 });
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendances', details: error.message });
  }
};

// Update an attendance record (Admin manual edit)
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params; // Using MongoDB _id or attendanceId
    const { clockIn, clockOut, status, attendanceType } = req.body;
    
    const record = await Attendance.findOne({ attendanceId: id });
    if (!record) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    if (clockIn) record.clockIn = new Date(clockIn);
    if (clockOut) record.clockOut = new Date(clockOut);
    
    if (record.clockOut && record.clockIn) {
      const diffMs = record.clockOut.getTime() - record.clockIn.getTime();
      record.totalHours = diffMs / (1000 * 60 * 60);
    }
    
    if (status) record.status = status;
    if (attendanceType) record.attendanceType = attendanceType;
    
    await record.save();
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update attendance', details: error.message });
  }
};
