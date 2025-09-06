/**
 * Middleware kiểm tra role của người dùng
 * @param {Array|String} roles - Role được phép truy cập (string hoặc array)
 */
const checkRole = (roles) => {
  return (req, res, next) => {
    // Đảm bảo req.user đã được set bởi middleware auth
    if (!req.user) {
      return res.status(401).json({ error: 'Chưa đăng nhập' });
    }

    // Chuyển roles thành mảng để dễ kiểm tra
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    // Kiểm tra role của user có trong danh sách được phép không
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Bạn không có quyền thực hiện thao tác này'
      });
    }

    // Nếu có quyền, cho phép request đi tiếp
    next();
  };
};

module.exports = checkRole;