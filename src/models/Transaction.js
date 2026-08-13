const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  receiptNumber: {
    type: String,
    required: true,
    unique: true
  },
  cashierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    default: null
  },
  status: {
    type: String,
    enum: ['Completed', 'Held', 'Voided', 'Refunded'],
    default: 'Completed'
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0.01 // Allows fractional quantities for weighed items
    },
    unitPrice: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    }
  }],
  totals: {
    subtotal: { type: Number, required: true },
    discountTotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true }
  },
  payment: {
    method: {
      type: String,
      enum: ['Cash', 'Card', 'Split', 'None'],
      required: true
    },
    amountPaid: { type: Number, required: true },
    change: { type: Number, default: 0 }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
