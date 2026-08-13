const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET all products
router.get('/', productController.getProducts);

// POST new product
router.post('/', productController.createProduct);

// PUT update product
router.put('/:id', productController.updateProduct);

// PATCH update stock
router.patch('/:id/stock', productController.updateStock);

// DELETE product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
