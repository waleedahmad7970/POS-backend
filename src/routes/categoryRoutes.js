const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET all categories
router.get('/', categoryController.getCategories);

// POST new category
router.post('/', categoryController.createCategory);

module.exports = router;
