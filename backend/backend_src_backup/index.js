import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { sequelize } from './models/index.js';
import './models/User.js';
import './models/VolunteerProfile.js';
import './models/BusinessProfile.js';
import './models/Opportunity.js';
import './models/Application.js';
import './models/Message.js';
import './models/Notification.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*' } });

// Socket.io Real-Time Messaging
io.on('connection', (socket) => {
  // Join a room for userId (for direct messages)
  socket.on('join_room', (userId) => {
    socket.join(userId);
  });

  // Send a message event
  socket.on('send_message', ({ senderId, receiverId, content }) => {
    // Emit to receiver's room
    io.to(receiverId).emit('receive_message', { senderId, content, timestamp: new Date() });
  });
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/volunteer-profile', (await import('./routes/volunteerProfile.js')).default);
app.use('/api/business-profile', (await import('./routes/businessProfile.js')).default);
app.use('/api/opportunity', (await import('./routes/opportunity.js')).default);
app.use('/api/application', (await import('./routes/application.js')).default);
app.use('/api/message', (await import('./routes/message.js')).default);
app.use('/api/notification', (await import('./routes/notification.js')).default);
app.use('/api/admin', (await import('./routes/admin.js')).default);
app.use('/api/upload', (await import('./routes/upload.js')).default);
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('SkillBridge API is running');
});

const PORT = process.env.PORT || 4000;

// Ensure uploads directory exists
import fs from 'fs';
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export { io };
