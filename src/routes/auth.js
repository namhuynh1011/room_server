const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Đăng ký tài khoản
router.post('/register', authController.register);

// Đăng nhập tài khoản
router.post('/login', authController.login);

// Quên mật khẩu
router.post('/forgot-password', authController.forgotPassword);

// Cập nhật thông tin tài khoản (yêu cầu đăng nhập)
router.put('/update', auth, authController.updateUser);

module.exports = router;