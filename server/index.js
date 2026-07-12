const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Make io accessible in controllers
app.set('io', io);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a goal's room to get live price updates
  socket.on('joinGoal', (goalId) => {
    socket.join(goalId);
    console.log(`User joined goal room: ${goalId}`);
  });

  // Leave goal room
  socket.on('leaveGoal', (goalId) => {
    socket.leave(goalId);
    console.log(`User left goal room: ${goalId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/stock', require('./routes/stockRoutes'));
app.use('/api/proof', require('./routes/proofRoutes'));
app.use('/api/ranking', require('./routes/rankingRoutes'));
app.use('/api/voice', require('./routes/voiceRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Test route
app.get('/', (req, res) => {
  res.send('LifeStock API Running...');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));