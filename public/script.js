const socket = io({
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
});

// Sound Manager
const sounds = {
    join: new Audio('/sounds/join.mp3'),
    pop: new Audio('/sounds/pop.mp3'),
    success: new Audio('/sounds/success.mp3'),
    click: new Audio('/sounds/click.mp3')
};

function playSound(name) {
    try {
        sounds[name].currentTime = 0;
        sounds[name].play().catch(e => console.log('Audio play blocked:', e));
    } catch (err) {
        console.error("Error playing sound:", err);
    }
}

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

// Socket Connection Status UI
socket.on('connect', () => {
    console.log('Connected to server');
    if (currentRoomId) {
        socket.emit('join_room', currentRoomId);
        displayRoomId.classList.remove('text-red-500');
        displayRoomId.classList.add('text-purple-600');
        displayRoomId.innerHTML = currentRoomId;
    }
});

socket.on('disconnect', () => {
    console.log('Disconnected');
    if (currentRoomId) {
        displayRoomId.innerHTML = `${currentRoomId} <span class="text-xs text-red-500">(Offline)</span>`;
        displayRoomId.classList.remove('text-purple-600');
        displayRoomId.classList.add('text-red-500');
    }
});

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

        // Timeout handling (fallback if server doesn't respond)
        const timeoutId = setTimeout(() => {
            if (questionText.innerHTML.includes('Thinking...')) {
                questionText.textContent = "Koneksi terputus atau server sibuk. Coba klik lagi ya! ⏳";
            }
        }, 5000); // 5 seconds timeout

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
socket.on('connect_error', (err) => {
    console.log('Connection Error:', err);
    // Optional: Notify user specifically about "Session ID unknown" if we catch it, 
    // but usually it's a generic transport error on the client side.
});

socket.on('new_question', (question) => {
    playSound('pop');
    questionText.textContent = question;
    resetDoneState();
});

socket.on('question_marked_done', () => {
    playSound('success');
    questionContainer.classList.add('bg-green-100', 'border-green-300');
    questionText.classList.add('line-through', 'text-gray-400');
    doneBtn.innerHTML = '<span>✅</span> Selesai!';
    doneBtn.classList.add('bg-green-100', 'text-green-700');
});

socket.on('partner_joined', () => {
    playSound('join');
    // Simple notification
    const notification = document.createElement('div');
    notification.className = 'absolute top-0 left-0 w-full bg-green-500 text-white text-center py-2 text-sm font-bold rounded-t-2xl animate-bounce';
    notification.textContent = 'Partner Joined! 🙋';
    gameScreen.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
});

function resetDoneState() {
    questionContainer.classList.remove('bg-green-100', 'border-green-300');
    questionText.classList.remove('line-through', 'text-gray-400');
    doneBtn.innerHTML = '<span>✅</span> Sudah Dibahas';
    doneBtn.classList.remove('bg-green-100', 'text-green-700');
}
