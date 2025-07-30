const express = require('express');
const cors = require('cors');
require('dotenv').config();

const http = require('http');
const app = express();
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true
}));
app.use(express.json());

// Kết nối db
const pool = require('./config/db');

// Route user
const userRouter = require('./routes/user');
app.use('/api/user', userRouter);

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const chatRouter = require('./routes/chat');
app.use('/api/chat', chatRouter);

// Khởi tạo server
const server = http.createServer(app);

// Import và khởi tạo socket.io riêng
require('./middleware/socket')(server, pool);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('Server started on port', PORT));