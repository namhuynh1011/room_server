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
const pool = require('./src/config/db');

// Route user
const userRouter = require('./src/routes/user');
app.use('/api/user', userRouter);
// Route auth
const authRouter = require('./src/routes/auth');
app.use('/api/auth', authRouter);
//Route chat
const chatRouter = require('./src/routes/chat');
app.use('/api/chat', chatRouter);

//Route room
const roomRouter = require('./src/routes/room');
app.use('/api/room', roomRouter);
//Route contract
const contractRouter = require('./src/routes/contract');
app.use('/api/contract', contractRouter);

// Khởi tạo server
const server = http.createServer(app);

// Import và khởi tạo socket.io riêng
require('./src/middleware/socket')(server, pool);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('Server started on port', PORT));