const socket = io();

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const gameScreen = document.getElementById('game-screen');
const joinBtn = document.getElementById('join-btn');
const roomIdInput = document.getElementById('room-id');
const displayRoomId = document.getElementById('display-room-id');
const questionText = document.getElementById('question-text');
const nextBtn = document.getElementById('next-btn');
const doneBtn = document.getElementById('done-btn');
const topicBtns = document.querySelectorAll('.topic-btn');
const questionContainer = document.getElementById('question-container');

// State
let currentRoomId = null;
let currentTopic = 'Deep Talk'; // Default

// Join Room Logic
joinBtn.addEventListener('click', () => {
    const roomId = roomIdInput.value.trim();
    if (roomId) {
        currentRoomId = roomId;
        socket.emit('join_room', roomId);

        loginScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        displayRoomId.textContent = roomId;
    } else {
        alert('Please enter a Room ID');
    }
});

// Topic Selection
topicBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentTopic = btn.dataset.topic;
        requestQuestion();

        // Update active state logic if needed
        topicBtns.forEach(b => b.classList.remove('bg-purple-100', 'border-purple-400'));
        btn.classList.add('bg-purple-100', 'border-purple-400');
    });
});

// Next Question
nextBtn.addEventListener('click', () => {
    requestQuestion();
});

function requestQuestion() {
    if (currentRoomId) {
        // Show loading state
        questionText.innerHTML = '<span class="animate-pulse">Thinking... 🤔</span>';
        resetDoneState();
        socket.emit('request_question', { roomId: currentRoomId, topic: currentTopic });
    }
}

// Mark as Done
doneBtn.addEventListener('click', () => {
    if (currentRoomId) {
        socket.emit('mark_done', currentRoomId);
    }
});

// Socket Events
socket.on('new_question', (question) => {
    questionText.textContent = question;
    resetDoneState();
});

socket.on('question_marked_done', () => {
    questionContainer.classList.add('bg-green-100', 'border-green-300');
    questionText.classList.add('line-through', 'text-gray-400');
    doneBtn.innerHTML = '<span>✅</span> Selesai!';
    doneBtn.classList.add('bg-green-100', 'text-green-700');
});

socket.on('partner_joined', () => {
    // Simple notification
    const notification = document.createElement('div');
    notification.className = 'absolute top-0 left-0 w-full bg-green-500 text-white text-center py-2 text-sm font-bold rounded-t-2xl animate-bounce';
    notification.textContent = 'Partner Joined! ❤️';
    gameScreen.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
});

function resetDoneState() {
    questionContainer.classList.remove('bg-green-100', 'border-green-300');
    questionText.classList.remove('line-through', 'text-gray-400');
    doneBtn.innerHTML = '<span>✅</span> Sudah Dibahas';
    doneBtn.classList.remove('bg-green-100', 'text-green-700');
}
