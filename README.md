# Connection Quiz ✨

A real-time conversation starter app to spark interesting discussions with friends, family, or partners.

## Prerequisites

- **Node.js** and **npm** must be installed on your machine.

## Installation

1. Navigate to the project directory:
   ```bash
   cd quizapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   *(Note: If `npm` was missing previously, ensure it is installed now)*

3. Configure Environment:
   - Open `.env` file.
   - Ensure `PORT=3000` is set.

## Running the App

1. Start the server:
   ```bash
   npm start
   ```

2. Open your browser and go to:
   `http://localhost:3000`

## How to Play

1. **User A**: Opens the app, enters a Room ID (e.g., `love1`), and clicks "Masuk Room".
2. **User B**: Opens the app on another device/tab, enters the **SAME** Room ID (`love1`), and joins.
3. Select a topic (e.g., "Deep Talk").
4. A question will appear on both screens using real-time synchronization.
5. Once discussed, click "Sudah Dibahas" (Mark as Done).
6. Click "Pertanyaan Selanjutnya" for a new question.

## Tech Stack

- **Node.js & Express**: Backend server.
- **Socket.io**: Real-time bidirectional communication.
- **TailwindCSS**: Styling.
