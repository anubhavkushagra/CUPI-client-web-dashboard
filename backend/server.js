require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const subsRoutes = require('./routes/subs');
const { initSocket } = require('./socket');
const { startPriceGeneration } = require('./utils/priceGenerator');

const app = express();
const server = http.createServer(app);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', subsRoutes);

// Socket.IO Setup
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow all for simplicity
        methods: ["GET", "POST"]
    }
});

// Initialize Socket Logic
initSocket(io);

// Start Price Generator
startPriceGeneration(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
