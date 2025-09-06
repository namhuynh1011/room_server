const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
// POST /api/rooms - Tạo phòng mới
router.post('/', auth, checkRole('landlord'), roomController.createRoom);

// GET /api/rooms - Lấy danh sách phòng của landlord
router.get('/',auth,  roomController.getRooms);

// GET /api/rooms/:id - Lấy chi tiết phòng theo ID
router.get('/roomdetail/:id', auth, roomController.getRoomById);

// PUT /api/rooms/:id - Cập nhật thông tin phòng
router.put('/:id', auth, roomController.updateRoom);

// DELETE /api/rooms/:id - Xóa phòng
router.delete('/:id', auth, checkRole('landlord'), roomController.deleteRoom);

//ấy danh sách phòng trống
router.get('/available', auth, roomController.getAvailableRooms);

module.exports = router;