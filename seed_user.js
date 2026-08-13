require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/epos_db';

const seedUser = async () => {
  try {
    await mongoose.connect(URI);
    await User.deleteMany({});
    
    await User.create({
      name: 'Test Cashier',
      employeeId: '1001',
      pinCode: '1234',
      role: 'Cashier'
    });
    
    console.log('✅ Wiped old users and seeded 1 new Cashier (ID: 1001, PIN: 1234)');
    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}
seedUser();
