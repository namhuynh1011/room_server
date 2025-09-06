const Contract = require('../models/Contract');
const Room = require('../models/Room');
const User = require('../models/User');
const  sequelize  = require('../config/db');
exports.create = async (req, res) => {
    try {
        const {
            contract_code,
            room_id,
            tenant_id,
            landlord_id,
            start_date,
            end_date,
            monthly_fee,
            electric_fee,
            water_fee,
            water_type,
            service_fee,
            deposit_amount,
            terms,
            payment_due_day,
            notes
        } = req.body;

        // Validate bắt buộc
        if (!room_id || !tenant_id || !landlord_id || !start_date || !end_date || !monthly_fee || !electric_fee || !water_fee || !service_fee || !deposit_amount || !terms) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        // Validate ngày
        if (new Date(start_date) >= new Date(end_date)) {
            return res.status(400).json({ success: false, message: "End date must be after start date" });
        }
        // Validate mã hợp đồng
        let code = contract_code;
        if (!code) {
            // Tự sinh mã hợp đồng nếu chưa có
            code = "CT" + Date.now();
        }
        // Kiểm tra tenant, landlord, room
        const [tenant, landlord, room] = await Promise.all([
            User.findByPk(tenant_id),
            User.findByPk(landlord_id),
            Room.findByPk(room_id)
        ]);
        if (!tenant || !landlord || !room) {
            return res.status(404).json({ success: false, message: "Tenant, landlord or room not found" });
        }

        // Tạo hợp đồng
        const contract = await Contract.create({
            contract_code: code,
            room_id,
            tenant_id,
            landlord_id,
            start_date,
            end_date,
            monthly_fee,
            electric_fee,
            water_fee,
            water_type,
            service_fee,
            deposit_amount,
            terms,
            payment_due_day,
            notes
        });

        // Cập nhật trạng thái phòng nếu cần (ví dụ: chuyển sang 'occupied')
        room.room_status = 'pending';
        await room.save();

        res.status(201).json({ success: true, data: contract });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Lấy danh sách hợp đồng (theo quyền: landlord, tenant, admin)
exports.list = async (req, res) => {
    try {
        let where = {};
        if (req.user.role === 'landlord') {
            where.landlord_id = req.user.id;
        }
        if (req.user.role === 'tenant') {
            where.tenant_id = req.user.id;
        }
        const contracts = await Contract.findAll({
            where,
            order: [['created_at', 'DESC']],
            include: [
                { model: User, as: 'landlord', attributes: ['id', 'full_name', 'email'] },
                { model: User, as: 'tenant', attributes: ['id', 'full_name', 'email'] },
                { model: Room, as: 'room', attributes: ['id', 'name', 'room_code'] }
            ]
        });
        // Trả về dữ liệu kèm tên landlord/tenant
        res.json({
            success: true,
            data: contracts.map(c => ({
                ...c.toJSON(),
                landlord_name: c.landlord?.full_name || '',
                tenant_name: c.tenant?.full_name || '',
                room_code: c.room?.room_code || ''
            }))
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Lấy chi tiết hợp đồng
exports.detail = async (req, res) => {
    try {
        const contract = await Contract.findByPk(req.params.id, {
            include: [
                { model: User, as: 'landlord', attributes: ['id', 'full_name', 'email'] },
                { model: User, as: 'tenant', attributes: ['id', 'full_name', 'email'] },
                { model: Room, as: 'room', attributes: ['id', 'name', 'room_code'] }
            ]
        });
        if (!contract) return res.status(404).json({ success: false, message: "Not found" });
        res.json({
            success: true,
            data: {
                ...contract.toJSON(),
                landlord_name: contract.landlord?.full_name || '',
                tenant_name: contract.tenant?.full_name || '',
                room_code: contract.room?.room_code || ''
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Cập nhật hợp đồng
exports.update = async (req, res) => {
    try {
        const contract = await Contract.findByPk(req.params.id);
        if (!contract) return res.status(404).json({ success: false, message: "Not found" });
        await contract.update(req.body);
        res.json({ success: true, data: contract });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Xóa hợp đồng
exports.remove = async (req, res) => {
    try {
        const contract = await Contract.findByPk(req.params.id);
        if (!contract) return res.status(404).json({ success: false, message: "Not found" });
        await contract.destroy();
        res.json({ success: true, message: "Deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Tenant xác nhận hợp đồng
exports.tenantAccept = async (req, res) => {
    try {
        // Tìm hợp đồng theo id
        const contract = await Contract.findByPk(req.params.id);
        if (!contract) {
            return res.status(404).json({ success: false, message: "Contract not found" });
        }

        // Kiểm tra quyền tenant
        if (contract.tenant_id !== req.user.id) {
            return res.status(403).json({ success: false, message: "You do not have permission to accept this contract." });
        }

        // Chỉ cho phép xác nhận nếu trạng thái là pending
        if (contract.status !== 'pending') {
            return res.status(400).json({ success: false, message: "Contract is not in pending status." });
        }

        // Cập nhật trạng thái, có thể thêm thời gian xác nhận
        await contract.update({
            status: 'payment_pending',
            tenant_accepted_at: new Date() // nếu có field này trong model
        });

        // Trả về hợp đồng mới nhất
        res.json({ success: true, data: contract });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Tenant từ chối hợp đồng
exports.tenantReject = async (req, res) => {
    try {
        const contract = await Contract.findByPk(req.params.id);
        if (!contract) {
            return res.status(404).json({ success: false, message: "Contract not found" });
        }
        if (contract.tenant_id !== req.user.id) {
            return res.status(403).json({ success: false, message: "You do not have permission to reject this contract." });
        }
        if (contract.status !== 'pending') {
            return res.status(400).json({ success: false, message: "Contract is not in pending status." });
        }

        await contract.update({
            status: 'cancelled',
            tenant_rejected_at: new Date()
        });

        res.json({ success: true, data: contract });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Landlord xác nhận hoàn thành hợp đồng
exports.complete = async (req, res) => {
    try {
        const contract = await Contract.findByPk(req.params.id);
        if (!contract) return res.status(404).json({ success: false, message: "Not found" });
        if (contract.landlord_id !== req.user.id && req.user.role !== 'admin')
            return res.status(403).json({ success: false, message: "Forbidden" });
        await contract.update({ status: 'active' });
        res.json({ success: true, data: contract });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};