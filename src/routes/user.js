const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole'); 

// READ - Lấy danh sách user (chỉ admin mới được phép)
router.get('/get-users', auth, checkRole('admin'), userController.getUsers);

// READ - Lấy user theo id
router.get('/get-user/:id', auth, userController.getUserById);

// DELETE - Xóa user (chỉ admin hoặc chính user đó mới được xóa)
router.delete('/delete-user/:id', auth, userController.deleteUser);

// Upload avatar
router.post('/upload-avatar', auth, upload.single('image'), userController.uploadAvatar);

// Tìm user theo email
router.get('/find', auth, userController.findByContact);

/*
// CREATE - Thêm user mới
router.post('/', userController.createUser);

// UPDATE - Cập nhật user
router.put('/update-user/:id', auth, userController.updateUser);
*/

module.exports = router;