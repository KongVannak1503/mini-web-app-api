const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect } = require('../middlewares/authMiddleware');


router.get('/count', protect, categoryController.getCategoryCount);
router.get('/', protect, categoryController.getCategories);
router.post('/', protect, categoryController.createCategory);
router.get('/:id', protect, categoryController.getCategory);
router.put('/:id', protect, categoryController.updateCategory);
router.delete('/:id', protect, categoryController.deleteCategory);

module.exports = router;
