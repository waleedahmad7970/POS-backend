const TillSession = require('../models/TillSession');
const Transaction = require('../models/Transaction');

exports.getTillSessions = async (req, res, next) => {
  try {
    const sessions = await TillSession.find()
      .populate('openedBy', 'name employeeId')
      .populate('closedBy', 'name employeeId')
      .sort({ openedAt: -1 });
    res.json(sessions);
  } catch (err) {
    next(err);
  }
};

exports.getActiveSession = async (req, res, next) => {
  try {
    const activeSession = await TillSession.findOne({ status: 'Open' })
      .populate('openedBy', 'name employeeId');
    res.json(activeSession);
  } catch (err) {
    next(err);
  }
};

exports.openTill = async (req, res, next) => {
  try {
    const { sessionId, openedBy, startingFloat } = req.body;
    
    // Check if there is already an open session
    const existingActive = await TillSession.findOne({ status: 'Open' });
    if (existingActive) {
      return res.status(400).json({ message: 'A till session is already open.' });
    }

    const newSession = new TillSession({
      sessionId: sessionId || new mongoose.Types.ObjectId().toString(),
      openedBy,
      openedAt: new Date(),
      startingFloat: startingFloat || 0,
      status: 'Open'
    });

    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (err) {
    next(err);
  }
};

exports.closeTill = async (req, res, next) => {
  try {
    const { sessionId, closedBy, actualCash, cashDrop, cashAdded, notes } = req.body;
    
    const session = await TillSession.findOne({ sessionId, status: 'Open' });
    if (!session) {
      return res.status(404).json({ message: 'Active till session not found.' });
    }

    // Calculate expected cash
    // We get all completed cash transactions for this session
    const transactions = await Transaction.find({ 
      tillSessionId: sessionId, 
      status: 'Completed',
      'payment.method': 'Cash'
    });

    const cashSales = transactions.reduce((sum, tx) => {
       // amountPaid could be higher than grandTotal if there's change.
       // The actual cash added to drawer is the grandTotal if it's a cash sale.
       return sum + tx.totals.grandTotal;
    }, 0);

    const expectedCash = session.startingFloat + cashSales + (cashAdded || 0) - (cashDrop || 0);
    const discrepancy = actualCash - expectedCash;

    session.closedBy = closedBy;
    session.closedAt = new Date();
    session.cashDrop = cashDrop || 0;
    session.cashAdded = cashAdded || 0;
    session.expectedCash = expectedCash;
    session.actualCash = actualCash;
    session.discrepancy = discrepancy;
    session.notes = notes || '';
    session.status = 'Closed';

    const savedSession = await session.save();
    res.json(savedSession);
  } catch (err) {
    next(err);
  }
};

exports.syncTillSessions = async (req, res, next) => {
  try {
    const { sessions } = req.body;
    
    if (!sessions || !Array.isArray(sessions)) {
      return res.status(400).json({ message: 'Invalid payload, expected array of sessions' });
    }

    const savedSessions = [];
    for (const s of sessions) {
      // Find existing by sessionId
      const existing = await TillSession.findOne({ sessionId: s.sessionId });
      
      if (existing) {
        // Only update if the local one is closed and server is open
        if (s.status === 'Closed' && existing.status === 'Open') {
           existing.closedBy = s.closedBy;
           existing.closedAt = s.closedAt;
           existing.cashDrop = s.cashDrop;
           existing.cashAdded = s.cashAdded;
           existing.expectedCash = s.expectedCash;
           existing.actualCash = s.actualCash;
           existing.discrepancy = s.discrepancy;
           existing.notes = s.notes;
           existing.status = 'Closed';
           await existing.save();
           savedSessions.push(existing);
        } else {
           // Maybe update cashDrop/Added if still open, but for simplicity we rely on close for finals
           // Just push the existing
           savedSessions.push(existing);
        }
      } else {
        // Insert new
        const newSession = new TillSession({
           sessionId: s.sessionId,
           openedBy: s.openedBy,
           closedBy: s.closedBy,
           openedAt: s.openedAt,
           closedAt: s.closedAt,
           startingFloat: s.startingFloat,
           cashDrop: s.cashDrop,
           cashAdded: s.cashAdded,
           expectedCash: s.expectedCash,
           actualCash: s.actualCash,
           discrepancy: s.discrepancy,
           status: s.status,
           notes: s.notes
        });
        const saved = await newSession.save();
        savedSessions.push(saved);
      }
    }

    res.json(savedSessions);
  } catch (err) {
    next(err);
  }
};
