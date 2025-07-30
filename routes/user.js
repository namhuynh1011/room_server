const express = require('express');
const router = express.Router();
const User = require('../models/User');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
// CREATE - Thêm user mới
// router.post('/', async (req, res) => {
//   try {
//     const { username, password, email, phone, full_name, role } = req.body;
//     const user = await User.create({ username, password, email, phone, full_name, role });
//     res.status(201).json(user);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// READ - Lấy danh sách user
router.get('/get-users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ - Lấy user theo id
router.get('/get-user/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User không tồn tại' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // UPDATE - Cập nhật user
// router.put('/update-user/:id', async (req, res) => {
//   try {
//     const {  password, email, phone, full_name, role } = req.body;
//     const user = await User.findByPk(req.params.id);
//     if (!user) return res.status(404).json({ error: 'User không tồn tại' });
//     await user.update({  password, email, phone, full_name, role });
//     res.json(user);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// DELETE - Xóa user
router.delete('/delete-user/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User không tồn tại' });
    await user.destroy();
    res.json({ message: 'Xóa user thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/upload-avatar', upload.single('image'), async (req, res) => {
  try {
    res.json({
      url: req.file.path,
      public_id: req.file.filename,
      message: 'Upload thành công!',
    });
  } catch (err) {
    res.status(500).json({ error: 'Upload thất bại!' });
  }
});

router.get('/find-by-email', auth, async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;