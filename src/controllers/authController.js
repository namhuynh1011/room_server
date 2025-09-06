const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendMail = require('../utils/sendMail');

// Đăng ký tài khoản
exports.register = async (req, res) => {
  try {
    const { password, email, phone, full_name, role } = req.body;

    // Kiểm tra phone/email đã tồn tại
    const existed = await User.findOne({ where: { [Op.or]: [{ phone }, { email }] } });
    if (existed) {
      return res.status(409).json({ error: 'Số điện thoại hoặc email đã tồn tại.' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user, không truyền profile_picture
    const user = await User.create({
      password: hashedPassword,
      email,
      phone,
      full_name,
      role
      // profile_picture sẽ tự động là NULL
    });

    res.status(201).json({ message: 'Đăng ký thành công', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Đăng nhập tài khoản
exports.login = async (req, res) => {
  try {
    const { phoneOrEmail, password } = req.body;
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { phone: phoneOrEmail },
          { email: phoneOrEmail }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Sai số điện thoại/email hoặc password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Sai số điện thoại/email hoặc password.' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Không trả về password
    const { password: pw, ...userData } = user.toJSON();

    res.json({ message: 'Đăng nhập thành công', user: userData, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Quên mật khẩu
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Email không tồn tại.' });
    }

    // Tạo mật khẩu mới
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    // Gửi mail cho user
    await sendMail(
      email,
      'Cấp lại mật khẩu mới',
      `Mật khẩu mới của bạn là: ${newPassword}`
    );

    res.json({ message: 'Mật khẩu mới đã được gửi tới email của bạn!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Cập nhật thông tin tài khoản
exports.updateUser = async (req, res) => {
  try {
    const { id, full_name, email, phone, password, profile_picture, zalo, facebook } = req.body;

    // Kiểm tra tồn tại user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
    }
    
    // Đảm bảo user cập nhật đúng tài khoản của mình
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Không có quyền cập nhật tài khoản này.' });
    }
    
    // Nếu đổi email hoặc phone, kiểm tra trùng lặp với người khác
    if (email && email !== user.email) {
      const existEmail = await User.findOne({ where: { email, id: { [Op.ne]: id } } });
      if (existEmail) {
        return res.status(409).json({ error: 'Email đã được sử dụng.' });
      }
    }
    
    if (phone && phone !== user.phone) {
      const existPhone = await User.findOne({ where: { phone, id: { [Op.ne]: id } } });
      if (existPhone) {
        return res.status(409).json({ error: 'Số điện thoại đã được sử dụng.' });
      }
    }

    // Nếu đổi mật khẩu, mã hóa lại
    let updateData = { full_name, email, phone, profile_picture, zalo, facebook };
    if (password && password.length > 0) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Cập nhật user
    await user.update(updateData);

    // Không trả về mật khẩu
    const { password: pw, ...userData } = user.toJSON();

    res.json({ message: 'Cập nhật thành công!', user: userData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};