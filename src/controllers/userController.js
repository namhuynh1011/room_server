const User = require('../models/User');
const { Op } = require('sequelize');

// Lấy danh sách user (trừ admin)
exports.getUsers = async (req, res) => {
  try {
    // Sử dụng điều kiện where để loại trừ các user có role là 'admin'
    const users = await User.findAll({
      where: {
        role: {
          [Op.ne]: 'admin'  // Op.ne = not equal, loại trừ admin
        }
      },
      attributes: ['id', 'full_name', 'email', 'phone', 'role', 'profile_picture', 'created_at', 'updated_at']
      // Loại bỏ password khỏi kết quả trả về để bảo mật
    });
    
    res.json(users);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách users:', err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy user theo id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User không tồn tại' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User không tồn tại' });
    
    // Kiểm tra quyền (chỉ admin hoặc chính user đó mới được xóa)
    if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'Không có quyền xóa user này' });
    }
    
    await user.destroy();
    res.json({ message: 'Xóa user thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload avatar
exports.uploadAvatar = async (req, res) => {
  try {
    res.json({
      url: req.file.path,
      public_id: req.file.filename,
      message: 'Upload thành công!',
    });
  } catch (err) {
    res.status(500).json({ error: 'Upload thất bại!' });
  }
};

// Tìm user theo email
exports.findByContact = async (req, res) => {
  const { email, phone } = req.query;
  try {
    if (!email && !phone) {
      return res.status(400).json({ error: 'Vui lòng cung cấp email hoặc số điện thoại' });
    }

    let user;
    if (email) {
      user = await User.findOne({ where: { email } });
    } else if (phone) {
      user = await User.findOne({ where: { phone } });
    }

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Chỉ trả về thông tin cơ bản để bảo mật
    res.json({
      id: user.id,
      email: user.email,
      phone: user.phone,
      full_name: user.full_name
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// CREATE - Thêm user mới (đã comment trong code gốc, giữ lại để tham khảo)
/*
exports.createUser = async (req, res) => {
  try {
    const { username, password, email, phone, full_name, role } = req.body;
    const user = await User.create({ username, password, email, phone, full_name, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
*/

// UPDATE - Cập nhật user (đã comment trong code gốc, giữ lại để tham khảo)
/*
exports.updateUser = async (req, res) => {
  try {
    const { password, email, phone, full_name, role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User không tồn tại' });
    await user.update({ password, email, phone, full_name, role });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
*/