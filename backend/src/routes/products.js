const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticate = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

// Public routes
router.get('/', productController.getAll);
router.get('/featured', productController.getFeatured);
router.get('/categories', productController.getCategories);
router.get('/:slug', productController.getBySlug);

// Admin routes
router.post('/', authenticate, adminOnly, productController.create);
router.put('/:id', authenticate, adminOnly, productController.update);
router.delete('/:id', authenticate, adminOnly, productController.remove);

module.exports = router;
