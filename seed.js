require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');

const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/epos_db';

const seedDatabase = async () => {
  try {
    await mongoose.connect(URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing
    await Category.deleteMany({});
    await Product.deleteMany({});
    
    // Seed Categories
    const categories = await Category.insertMany([
      { name: 'Produce', color: '#22c55e' },
      { name: 'Dairy & Eggs', color: '#facc15' },
      { name: 'Meat & Seafood', color: '#ef4444' },
      { name: 'Bakery', color: '#d97706' },
      { name: 'Beverages', color: '#3b82f6' },
      { name: 'Snacks', color: '#ec4899' },
      { name: 'Pantry', color: '#78350f' },
      { name: 'Household', color: '#94a3b8' }
    ]);
    
    console.log(`✅ Seeded ${categories.length} categories.`);

    const catMap = {};
    categories.forEach(c => catMap[c.name] = c._id);

    // Seed 50 realistic products
    const products = await Product.insertMany([
      // Produce
      { name: 'Organic Bananas', category: catMap['Produce'], price: 1.20, stock: 0, isWeighed: true },
      { name: 'Fuji Apples', category: catMap['Produce'], price: 2.50, stock: 0, isWeighed: true },
      { name: 'Avocados', category: catMap['Produce'], price: 1.50, stock: 150, isWeighed: false },
      { name: 'Carrots', category: catMap['Produce'], price: 1.10, stock: 0, isWeighed: true },
      { name: 'Broccoli Crowns', category: catMap['Produce'], price: 1.80, stock: 0, isWeighed: true },
      { name: 'Romaine Hearts', category: catMap['Produce'], price: 3.50, stock: 45, isWeighed: false },
      { name: 'Lemons', category: catMap['Produce'], price: 0.80, stock: 200, isWeighed: false },
      { name: 'Yellow Onions', category: catMap['Produce'], price: 1.30, stock: 0, isWeighed: true },
      
      // Dairy & Eggs
      { name: 'Whole Milk 1 Gal', category: catMap['Dairy & Eggs'], price: 3.80, stock: 50, isWeighed: false },
      { name: 'Almond Milk', category: catMap['Dairy & Eggs'], price: 4.20, stock: 60, isWeighed: false },
      { name: 'Large Brown Eggs', category: catMap['Dairy & Eggs'], price: 5.50, stock: 80, isWeighed: false },
      { name: 'Cheddar Cheese Block', category: catMap['Dairy & Eggs'], price: 4.90, stock: 40, isWeighed: false },
      { name: 'Salted Butter', category: catMap['Dairy & Eggs'], price: 4.50, stock: 55, isWeighed: false },
      { name: 'Greek Yogurt (Plain)', category: catMap['Dairy & Eggs'], price: 5.20, stock: 35, isWeighed: false },
      { name: 'Heavy Cream', category: catMap['Dairy & Eggs'], price: 3.50, stock: 30, isWeighed: false },
      
      // Meat & Seafood
      { name: 'Chicken Breast', category: catMap['Meat & Seafood'], price: 5.99, stock: 0, isWeighed: true },
      { name: 'Ground Beef 80/20', category: catMap['Meat & Seafood'], price: 6.49, stock: 0, isWeighed: true },
      { name: 'Atlantic Salmon Fillet', category: catMap['Meat & Seafood'], price: 12.99, stock: 0, isWeighed: true },
      { name: 'Pork Chops', category: catMap['Meat & Seafood'], price: 4.99, stock: 0, isWeighed: true },
      { name: 'Bacon 1lb', category: catMap['Meat & Seafood'], price: 7.50, stock: 40, isWeighed: false },
      { name: 'Turkey Sausage', category: catMap['Meat & Seafood'], price: 5.50, stock: 35, isWeighed: false },
      
      // Bakery
      { name: 'Sourdough Loaf', category: catMap['Bakery'], price: 4.50, stock: 20, isWeighed: false },
      { name: 'French Baguette', category: catMap['Bakery'], price: 2.99, stock: 30, isWeighed: false },
      { name: 'Blueberry Muffins (4)', category: catMap['Bakery'], price: 5.00, stock: 15, isWeighed: false },
      { name: 'Butter Croissant', category: catMap['Bakery'], price: 2.50, stock: 45, isWeighed: false },
      { name: 'Whole Wheat Bread', category: catMap['Bakery'], price: 3.50, stock: 25, isWeighed: false },
      
      // Beverages
      { name: 'Spring Water 24pk', category: catMap['Beverages'], price: 6.99, stock: 100, isWeighed: false },
      { name: 'Cola 12pk', category: catMap['Beverages'], price: 7.50, stock: 85, isWeighed: false },
      { name: 'Orange Juice', category: catMap['Beverages'], price: 4.99, stock: 40, isWeighed: false },
      { name: 'Iced Tea Gal', category: catMap['Beverages'], price: 3.50, stock: 30, isWeighed: false },
      { name: 'Cold Brew Coffee', category: catMap['Beverages'], price: 5.50, stock: 25, isWeighed: false },
      { name: 'Sparkling Water 8pk', category: catMap['Beverages'], price: 4.50, stock: 65, isWeighed: false },
      
      // Snacks
      { name: 'Potato Chips', category: catMap['Snacks'], price: 4.29, stock: 70, isWeighed: false },
      { name: 'Tortilla Chips', category: catMap['Snacks'], price: 3.99, stock: 60, isWeighed: false },
      { name: 'Mixed Nuts', category: catMap['Snacks'], price: 8.99, stock: 40, isWeighed: false },
      { name: 'Chocolate Bar', category: catMap['Snacks'], price: 1.99, stock: 150, isWeighed: false },
      { name: 'Popcorn', category: catMap['Snacks'], price: 3.50, stock: 55, isWeighed: false },
      { name: 'Granola Bars', category: catMap['Snacks'], price: 4.50, stock: 45, isWeighed: false },
      
      // Pantry
      { name: 'Olive Oil 16oz', category: catMap['Pantry'], price: 8.50, stock: 35, isWeighed: false },
      { name: 'All Purpose Flour', category: catMap['Pantry'], price: 3.50, stock: 40, isWeighed: false },
      { name: 'Granulated Sugar', category: catMap['Pantry'], price: 3.20, stock: 50, isWeighed: false },
      { name: 'Spaghetti Pasta', category: catMap['Pantry'], price: 1.50, stock: 90, isWeighed: false },
      { name: 'Marinara Sauce', category: catMap['Pantry'], price: 2.99, stock: 75, isWeighed: false },
      { name: 'Peanut Butter', category: catMap['Pantry'], price: 3.99, stock: 60, isWeighed: false },
      { name: 'Strawberry Jam', category: catMap['Pantry'], price: 3.50, stock: 50, isWeighed: false },
      { name: 'Canned Black Beans', category: catMap['Pantry'], price: 1.20, stock: 120, isWeighed: false },
      
      // Household
      { name: 'Paper Towels 6pk', category: catMap['Household'], price: 12.99, stock: 30, isWeighed: false },
      { name: 'Toilet Paper 12pk', category: catMap['Household'], price: 14.99, stock: 25, isWeighed: false },
      { name: 'Dish Soap', category: catMap['Household'], price: 3.50, stock: 45, isWeighed: false },
      { name: 'Laundry Detergent', category: catMap['Household'], price: 15.99, stock: 20, isWeighed: false },
      { name: 'Trash Bags 40ct', category: catMap['Household'], price: 8.99, stock: 35, isWeighed: false },
      { name: 'All-Purpose Cleaner', category: catMap['Household'], price: 4.50, stock: 40, isWeighed: false }
    ]);

    console.log(`✅ Seeded ${products.length} products.`);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed:', err);
    process.exit(1);
  }
};

seedDatabase();
