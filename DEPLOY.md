# Deployment Guide 🚀

## ⚠️ Important Note About Vercel

You requested deployment to **Vercel**. I have added the `vercel.json` configuration file to support this

**HOWEVER, PLEASE NOTE:**
This application uses **Socket.io** (WebSockets) for real-time features (connecting two users). **Vercel Serverless Functions do NOT support persistent WebSocket connections natively.**
- If you deploy to Vercel, the app might load, but the real-time connection between you and your partner will likely fail or disconnect frequently.

## ✅ Recommended Alternative: Render or Railway

For Node.js apps with WebSockets (like this one), platforms like **Render** or **Railway** are much better because they keep the server running continuously.

### Option 1: Deploy to Render (Recommended)

1.  Push your code to a **GitHub repository**.
2.  Go to [dashboard.render.com](https://dashboard.render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  Render will automatically detect Node.js.
6.  (Optional) Add your `OPENAI_API_KEY` in the Environment Variables section if you decide to use AI features again.
7.  Click **Create Web Service**.

### Option 2: Deploy to Railway (Recommended for Stability) 🚂

Railway is excellent for this app because it keeps the WebSocket connection alive.

1.  **Push to GitHub**: Ensure your latest code is pushed to your GitHub repository.
2.  **Sign Up/Login**: Go to [railway.app](https://railway.app/) and log in with GitHub.
3.  **New Project**:
    - Click **+ New Project** on the dashboard.
    - Select **Deploy from GitHub repo**.
    - Choose your repository (`quizapp`).
4.  **Configuration**:
    - Railway usually detects `Node.js` automatically.
    - It will automatically use the `npm start` script from `package.json`.
    - It sets a `$PORT` variable automatically, which our `server.js` already uses (`process.env.PORT`).
5.  **Domain**:
    - Once deployed, go to **Settings** -> **Domains**.
    - Click **Generate Domain** to get a public URL (e.g., `web-production-123.up.railway.app`).
6.  **Done!**: Share that URL with your partner.

**Why Railway?**
- Supports persistence (WebSocket doesn't drop easily).
- Free trial available.
- Zero config for Node.js apps like this one.

### Option 3: Deploy to Glitch (Easiest for testing)

1.  Go to [glitch.com](https://glitch.com/).
2.  Click **New Project** -> **Import from GitHub**.
3.  Paste your repository URL.
4.  It will run instantly!

---

## If you still want to try Vercel:

1.  Install Vercel CLI: `npm i -g vercel`
2.  Run: `vercel`
3.  Follow the prompts.
