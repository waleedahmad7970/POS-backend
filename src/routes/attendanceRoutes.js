const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Get all attendance records
router.get('/', attendanceController.getAttendances);

// Sync batch from offline POS
router.post('/sync', attendanceController.syncAttendances);

// Admin manual edit
router.put('/:id', attendanceController.updateAttendance);

module.exports = router;
