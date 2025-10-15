# Team Voting - Real-Time Suggestion & Voting Platform

A real-time collaborative voting application where team members can submit ideas, vote, and add comments. Built with React, Vite, Tailwind CSS, and Firebase Realtime Database.

## Features

- **Real-time Synchronization**: All changes (votes, suggestions, comments) sync instantly across all users
- **Voting System**: Upvote and downvote suggestions with live score updates
- **Comments with Labels**: Add comments labeled as Pro, Con, or Neutral
- **Smart Sorting**: Suggestions automatically sorted by score (upvotes - downvotes)
- **User-Friendly**: Simple display name entry, no complex authentication required
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations

## Tech Stack

- **Frontend**: React 19 with Vite
- **Styling**: Tailwind CSS 4
- **Backend**: Firebase Realtime Database
- **Deployment**: Vercel

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Firebase account (free tier is sufficient)
- A GitHub account (for Vercel deployment)

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "team-voting")
4. (Optional) Enable Google Analytics
5. Click "Create project"

### 2. Set Up Realtime Database

1. In your Firebase project, navigate to **Build** → **Realtime Database**
2. Click **Create Database**
3. Choose a location close to your users
4. Start in **Test mode** for development (you can update security rules later)
5. Click **Enable**

### 3. Get Your Firebase Configuration

1. In the Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select **Project settings**
3. Scroll down to "Your apps" section
4. Click the **Web** icon (`</>`) to add a web app
5. Register your app with a nickname (e.g., "Voting Web App")
6. Copy the `firebaseConfig` object values

### 4. Update Security Rules (Important for Production)

For development, the test mode rules are fine. For production, update your Realtime Database rules:

1. Go to **Realtime Database** → **Rules**
2. Update to the following (or customize based on your needs):

```json
{
  "rules": {
    "suggestions": {
      ".read": true,
      ".write": true,
      "$suggestionId": {
        ".validate": "newData.hasChildren(['text', 'author', 'timestamp'])"
      }
    }
  }
}
```

**Note**: These rules allow anyone to read and write. For better security in production, implement proper authentication and more restrictive rules.

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/voter-cc.git
cd voter-cc
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

1. Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

2. Open `.env` and add your Firebase configuration values from step 3 above:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### 6. Preview Production Build

```bash
npm run preview
```

## Deployment to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub**:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Sign in with your GitHub account
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration

3. **Add Environment Variables**:
   - In the Vercel project settings, go to "Environment Variables"
   - Add each of your Firebase environment variables:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_DATABASE_URL`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your app
   - You'll get a URL like `https://your-app.vercel.app`

5. **Automatic Deployments**:
   - Every push to your `main` branch will automatically trigger a new deployment
   - Pull requests will get preview deployments

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:

```bash
npm install -g vercel
```

2. **Login to Vercel**:

```bash
vercel login
```

3. **Deploy**:

```bash
vercel
```

Follow the prompts, and make sure to add your environment variables when prompted.

### Option 3: Deploy with Environment Variables

```bash
vercel --env VITE_FIREBASE_API_KEY=your_value --env VITE_FIREBASE_AUTH_DOMAIN=your_value ...
```

## Project Structure

```
voter-cc/
├── src/
│   ├── components/
│   │   ├── UserLogin.jsx         # Display name entry component
│   │   ├── SuggestionForm.jsx    # Form to submit new suggestions
│   │   └── SuggestionCard.jsx    # Individual suggestion with votes/comments
│   ├── hooks/
│   │   └── useSuggestions.js     # Custom hook for Firebase real-time sync
│   ├── config/
│   │   └── firebase.js           # Firebase configuration
│   ├── App.jsx                   # Main application component
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global styles with Tailwind
├── public/                       # Static assets
├── index.html                    # HTML template
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## Data Structure

The app uses Firebase Realtime Database with the following structure:

```
/suggestions
  /{suggestionId}
    - id: string
    - text: string
    - author: string (display name)
    - timestamp: number
    - votes: {
        {userId}: "up" | "down"
      }
    - comments: {
        {commentId}: {
          text: string
          author: string
          type: "pro" | "con" | "neutral"
          timestamp: number
        }
      }
```

## Usage

1. **Enter Your Name**: When you first visit, enter your display name
2. **Submit Ideas**: Type your suggestion in the input field and click "Add Suggestion"
3. **Vote**: Click the up or down arrow on any suggestion to vote
4. **Change Vote**: Click the same arrow again to remove your vote, or click the opposite arrow to change it
5. **Add Comments**: Click the comment button to expand the comment section
6. **Label Comments**: Choose Pro, Con, or Neutral when adding a comment
7. **Real-time Updates**: Watch as other team members' votes and suggestions appear instantly

## Features Explained

### Voting System
- Each user can upvote or downvote any suggestion
- Users can change their vote at any time
- Score is calculated as: upvotes - downvotes
- Suggestions are automatically sorted by score

### Comments System
- Three comment types: Pro (positive), Con (negative), Neutral
- Each comment shows the author and timestamp
- Comments are color-coded by type
- Newest comments appear first

### Real-time Sync
- Uses Firebase Realtime Database for instant synchronization
- No need to refresh the page
- All changes propagate to all users within milliseconds

## Troubleshooting

### Firebase Connection Issues

**Problem**: "Failed to connect to Firebase"

**Solution**:
- Verify all environment variables are correctly set in `.env`
- Ensure the Realtime Database is enabled in Firebase Console
- Check that your Firebase rules allow read/write access

### Build Errors

**Problem**: "Module not found" errors

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Vercel Deployment Issues

**Problem**: App works locally but not on Vercel

**Solution**:
- Verify all environment variables are added in Vercel project settings
- Check build logs in Vercel dashboard for specific errors
- Ensure your `.env` file is NOT committed to Git (it should be in `.gitignore`)

### Database Rules Error

**Problem**: "Permission denied" when reading/writing data

**Solution**:
- Go to Firebase Console → Realtime Database → Rules
- Temporarily set rules to test mode (shown in Firebase Setup section)
- For production, implement proper authentication and security rules

## Customization

### Change Color Scheme

Edit [tailwind.config.js](tailwind.config.js) to customize colors:

```js
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    }
  }
}
```

### Modify Voting Logic

Edit [src/hooks/useSuggestions.js](src/hooks/useSuggestions.js) to change how votes are handled.

### Add Features

Some ideas for enhancements:
- User avatars
- Suggestion categories/tags
- Search and filter
- Export results to CSV
- Voting deadlines
- Anonymous suggestions option
- Vote weight/priority system

## Performance Notes

- The app is optimized for teams of 10-20 users
- For larger teams (50+), consider implementing pagination
- Firebase Realtime Database is highly scalable
- Vercel's CDN ensures fast global delivery

## Security Considerations

### For Production Use:

1. **Implement Authentication**: Use Firebase Authentication for verified users
2. **Restrict Database Rules**: Only allow authenticated users to write
3. **Rate Limiting**: Implement rate limits to prevent spam
4. **Input Validation**: Add server-side validation for suggestions and comments
5. **Environment Variables**: Never commit `.env` files to version control

## Support

For issues or questions:
1. Check the [Firebase Documentation](https://firebase.google.com/docs/database)
2. Review [Vite Documentation](https://vitejs.dev/)
3. Check [Vercel Documentation](https://vercel.com/docs)

## License

MIT License - feel free to use this for your team projects!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using React, Vite, Tailwind CSS, and Firebase
