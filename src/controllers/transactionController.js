const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find()
      .populate('cashierId', 'name employeeId')
      .populate('customerId', 'name phone')
      .sort({ timestamp: -1 });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

exports.createTransaction = async (req, res, next) => {
  try {
    const newTx = new Transaction(req.body);
    const savedTx = await newTx.save();

    // Handle Stock Management
    if (savedTx.items && savedTx.items.length > 0) {
      for (const item of savedTx.items) {
        // If it's a completed sale, deduct stock. If it's a refund, add stock back.
        const quantityChange = savedTx.status === 'Refunded' ? Math.abs(item.quantity) : -Math.abs(item.quantity);
        
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: quantityChange }
        });
      }
    }

    res.status(201).json(savedTx);
  } catch (err) {
    next(err);
  }
};
