const express = require('express');
const router = express.Router();
const tillSessionController = require('../controllers/tillSessionController');

// GET all till sessions
router.get('/', tillSessionController.getTillSessions);

// GET active till session
router.get('/active', tillSessionController.getActiveSession);

// POST open a new till session
router.post('/open', tillSessionController.openTill);

// POST close an active till session
router.post('/close', tillSessionController.closeTill);

// POST sync multiple till sessions (offline sync)
router.post('/sync', tillSessionController.syncTillSessions);

module.exports = router;
