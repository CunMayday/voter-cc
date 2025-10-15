# Quick Start Guide

Get up and running in 5 minutes!

## 1. Set Up Firebase (3 minutes)

1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Name it "team-voting" → Continue → Create project
4. Click "Realtime Database" in the left menu
5. Click "Create Database" → Choose location → Start in test mode → Enable
6. Click the gear icon ⚙️ → Project settings
7. Scroll down → Click the Web icon `</>`
8. Register app → Copy the config values

## 2. Configure Your App (1 minute)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and paste your Firebase config values

## 3. Install & Run (1 minute)

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser!

## 4. Deploy to Vercel (Optional)

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. Go to https://vercel.com
3. Import your GitHub repo
4. Add environment variables from your `.env` file
5. Deploy!

## What to Test

- Enter your name
- Add a suggestion
- Upvote/downvote it
- Add a comment (try Pro, Con, Neutral)
- Open in another browser tab with a different name
- Watch real-time updates!

## Need Help?

See [README.md](README.md) for detailed instructions.
