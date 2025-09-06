const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Tạo hợp đồng mới (chỉ landlord hoặc admin)
router.post('/', auth, checkRole(['landlord', 'admin']), contractController.create);

// Lấy danh sách hợp đồng (lọc theo quyền)
router.get('/', auth, contractController.list);

// Lấy chi tiết hợp đồng theo id
router.get('/:id', auth, contractController.detail);

// Cập nhật hợp đồng
router.put('/:id', auth, checkRole(['landlord', 'admin']), contractController.update);

// Xóa hợp đồng
router.delete('/:id', auth, checkRole(['landlord', 'admin']), contractController.remove);

// Tenant xác nhận hợp đồng
router.post('/:id/accept', auth, checkRole(['tenant']), contractController.tenantAccept);

// Tenant từ chối hợp đồng
router.post('/:id/reject', auth, checkRole(['tenant']), contractController.tenantReject);

// Landlord xác nhận hoàn thành hợp đồng
router.post('/:id/complete', auth, checkRole(['landlord', 'admin']), contractController.complete);

module.exports = router;