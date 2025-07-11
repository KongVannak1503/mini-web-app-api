const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { dynamicUploader } = require('../middlewares/upload');

// router.post('/logout', userController.logout);
const uploadEmployeesFile = dynamicUploader('file', 'employees');

router.get('/', protect, userController.getUsers);

router.post('/', protect, uploadEmployeesFile, userController.registerUser);

router.get('/:id', protect, userController.getUser);
router.put('/:id', protect, uploadEmployeesFile, userController.updateUser);
router.delete('/:id', protect, userController.deleteUser);

module.exports = router;
