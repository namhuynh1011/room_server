const Room = require('../models/Room');
const  sequelize  = require('../config/db');

// API tạo room mới
exports.createRoom = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { 
      room_code, 
      name, 
      room_fee, 
      room_area,
      room_status = 'available'
    } = req.body;
    
    // Validate dữ liệu đầu vào
    if (!room_code || !name || !room_fee || !room_area) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin phòng' });
    }
    
    // Kiểm tra mã phòng đã tồn tại chưa
    const existingRoom = await Room.findOne({ 
      where: { 
        room_code,
        landlord_id: req.user.id 
      }
    });
    
    if (existingRoom) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Mã phòng đã tồn tại' });
    }
    
    // Tạo phòng mới
    const room = await Room.create({
      landlord_id: req.user.id,  // ID của người đang đăng nhập (chủ trọ)
      room_code,
      name,
      room_fee,
      room_area,
      room_status,
      created_at: new Date(),
      updated_at: new Date()
    }, { transaction });
    
    await transaction.commit();
    
    res.status(201).json({
      message: 'Tạo phòng thành công',
      room
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Lỗi khi tạo phòng:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo phòng' });
  }
};

// Lấy danh sách phòng của người đăng nhập (landlord)
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      where: { landlord_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    
    res.json({ rooms });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phòng:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách phòng' });
  }
};

// Lấy chi tiết phòng
exports.getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findOne({
      where: { 
        id,
        landlord_id: req.user.id  // Đảm bảo chỉ lấy phòng của user đăng nhập
      }
    });
    
    if (!room) {
      return res.status(404).json({ error: 'Không tìm thấy phòng hoặc không có quyền truy cập' });
    }
    
    res.json({ room });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin phòng:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin phòng' });
  }
};

// Cập nhật thông tin phòng
exports.updateRoom = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { 
      room_code, 
      name, 
      room_fee, 
      room_area,
      room_status
    } = req.body;
    
    // Kiểm tra phòng tồn tại và thuộc về người đăng nhập
    const room = await Room.findOne({
      where: { 
        id,
        landlord_id: req.user.id 
      }
    });
    
    if (!room) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Không tìm thấy phòng hoặc không có quyền truy cập' });
    }
    
    // Kiểm tra mã phòng đã tồn tại (nếu thay đổi mã)
    if (room_code !== room.room_code) {
      const existingRoom = await Room.findOne({ 
        where: { 
          room_code,
          landlord_id: req.user.id,
          id: { [sequelize.Op.ne]: id }  // Không phải phòng hiện tại
        }
      });
      
      if (existingRoom) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Mã phòng đã tồn tại' });
      }
    }
    
    // Cập nhật thông tin phòng
    await room.update({
      room_code: room_code || room.room_code,
      name: name || room.name,
      room_fee: room_fee || room.room_fee,
      room_area: room_area || room.room_area,
      room_status: room_status || room.room_status,
      updated_at: new Date()
    }, { transaction });
    
    await transaction.commit();
    
    // Lấy phòng sau khi cập nhật
    const updatedRoom = await Room.findByPk(id);
    
    res.json({
      message: 'Cập nhật phòng thành công',
      room: updatedRoom
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Lỗi khi cập nhật phòng:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật phòng' });
  }
};

// Xóa phòng
exports.deleteRoom = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    // Kiểm tra phòng tồn tại và thuộc về người đăng nhập
    const room = await Room.findOne({
      where: { 
        id,
        landlord_id: req.user.id 
      }
    });
    
    if (!room) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Không tìm thấy phòng hoặc không có quyền truy cập' });
    }
    
    // Xóa phòng
    await room.destroy({ transaction });
    
    await transaction.commit();
    
    res.json({
      message: 'Xóa phòng thành công',
      roomId: id
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Lỗi khi xóa phòng:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa phòng' });
  }
};
exports.getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      where: { room_status: 'available' },
      attributes: ['id', 'room_code', 'room_status']
    });
    res.json({ success: true, data: rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};