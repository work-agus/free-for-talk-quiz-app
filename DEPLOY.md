# Deployment Guide 🚀

## ⚠️ Important Note About Vercel

You requested deployment to **Vercel**. I have added the `vercel.json` configuration file to support this.

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

### Option 2: Deploy to Railway

1.  Go to [railway.app](https://railway.app/).
2.  Login with GitHub.
3.  Click **New Project** -> **Deploy from GitHub repo**.
4.  Select your repository.
5.  Railway will handle the rest!

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
