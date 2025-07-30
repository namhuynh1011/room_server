const socketio = require('socket.io');

module.exports = (server, pool) => {
  const io = socketio(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('joinConversation', (conversationId) => {
      socket.join(String(conversationId));
      const room = io.sockets.adapter.rooms.get(String(conversationId));
      console.log(`Room ${conversationId} has ${room ? room.size : 0} members`);
    });

    socket.on('sendMessage', async (data) => {
      try {
        const [result] = await pool.query(
          'INSERT INTO messages (conversation_id, sender_id, receiver_id, content, type) VALUES (?, ?, ?, ?, ?)',
          [data.conversation_id, data.sender_id, data.receiver_id, data.content, data.type || 'text']
        );
        await pool.query(
          'UPDATE conversations SET updated_at=NOW() WHERE id=?',
          [data.conversation_id]
        );
        const [msgRows] = await pool.query(
          'SELECT * FROM messages WHERE id=?',
          [result.insertId]
        );
        const msg = msgRows[0];
        io.to(String(data.conversation_id)).emit('receiveMessage', msg);
      } catch (err) {
        socket.emit('error', { error: err.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};
