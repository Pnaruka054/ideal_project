require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const Routes = require('./routes/routes');
const socketIo = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);

// Initialize Socket.io with the HTTP server and configure CORS
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5173', // Replace with your frontend URL
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type']
    }
});

let activeUsers = 0;

io.on('connection', (socket) => {
    activeUsers++;
    io.emit('activeUsers', activeUsers);

    socket.on('disconnect', () => {
        activeUsers--;
        io.emit('activeUsers', activeUsers);
    });
});

async function dataBase_connection() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
    }
}
dataBase_connection();

app.use(cors({
    origin: '/', // Adjust to your frontend URL if different
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(Routes);
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server started on port - ${PORT}`);
});
