require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Store room states
const rooms = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a room
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);

        if (!rooms[roomId]) {
            rooms[roomId] = {
                currentQuestion: null,
                isDone: false,
                users: []
            };
        }
        rooms[roomId].users.push(socket.id);

        // Notify others in room
        socket.to(roomId).emit('partner_joined');

        // Send current state if exists
        if (rooms[roomId].currentQuestion) {
            socket.emit('new_question', rooms[roomId].currentQuestion);
            if (rooms[roomId].isDone) {
                socket.emit('question_marked_done');
            }
        }
    });

    // Load questions
    const questionsData = require('./questions.json');

    // ... (socket connection logic)

    // Request new question
    socket.on('request_question', async ({ roomId, topic }) => {
        try {
            // Get questions for the topic
            const topicQuestions = questionsData[topic];

            let question;
            if (topicQuestions && topicQuestions.length > 0) {
                // Pick random question from JSON
                const randomIndex = Math.floor(Math.random() * topicQuestions.length);
                question = topicQuestions[randomIndex];
            } else {
                // Fallback if topic not found in JSON
                question = "Topik tidak ditemukan, coba topik lain ya!";
            }

            // Update room state
            if (rooms[roomId]) {
                rooms[roomId].currentQuestion = question;
                rooms[roomId].isDone = false;
            }

            // Broadcast to all in room
            io.to(roomId).emit('new_question', question);

        } catch (error) {
            console.error("Error getting question:", error);
            const errorMsg = "Maaf, ada kesalahan saat mengambil pertanyaan.";
            io.to(roomId).emit('new_question', errorMsg);
        }
    });

    // Mark question as done
    socket.on('mark_done', (roomId) => {
        if (rooms[roomId]) {
            rooms[roomId].isDone = true;
            io.to(roomId).emit('question_marked_done');
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Cleanup logic could go here (remove user from room users list)
        for (const roomId in rooms) {
            rooms[roomId].users = rooms[roomId].users.filter(id => id !== socket.id);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
