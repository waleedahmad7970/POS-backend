const Customer = require('../models/Customer');

exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    next(err);
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const newCust = new Customer(req.body);
    const savedCust = await newCust.save();
    res.status(201).json(savedCust);
  } catch (err) {
    next(err);
  }
};
