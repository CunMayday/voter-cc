# Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel.

## Pre-Deployment Checklist

### 1. Firebase Setup
- [ ] Created Firebase project at console.firebase.google.com
- [ ] Enabled Realtime Database
- [ ] Database rules configured (test mode for development)
- [ ] Copied Firebase configuration values
- [ ] Created `.env` file with Firebase credentials
- [ ] Tested Firebase connection locally

### 2. Local Testing
- [ ] Ran `npm install` successfully
- [ ] Ran `npm run dev` and app loads at localhost:5173
- [ ] Tested user login with display name
- [ ] Tested submitting a suggestion
- [ ] Tested upvoting/downvoting
- [ ] Tested adding comments (Pro, Con, Neutral)
- [ ] Tested with multiple browser tabs (real-time sync)
- [ ] Tested on mobile device (responsive design)
- [ ] Ran `npm run build` successfully
- [ ] No console errors in browser

### 3. Code Quality
- [ ] Removed any console.log statements (or kept only necessary ones)
- [ ] No hardcoded credentials in source code
- [ ] `.env` file is in `.gitignore`
- [ ] All components are properly commented
- [ ] No unused imports or files

### 4. Git Repository
- [ ] Initialized Git repository (`git init`)
- [ ] Created GitHub repository
- [ ] Added all files to Git
- [ ] Committed changes
- [ ] Pushed to GitHub main branch

```bash
git add .
git commit -m "Initial commit - Team Voting App"
git push origin main
```

## Vercel Deployment Steps

### 5. Vercel Account Setup
- [ ] Created account at vercel.com
- [ ] Connected GitHub account to Vercel
- [ ] Authorized Vercel to access your repositories

### 6. Import Project
- [ ] Clicked "Add New Project" in Vercel dashboard
- [ ] Selected your GitHub repository
- [ ] Vercel auto-detected Vite configuration
- [ ] Confirmed build settings:
  - Framework: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`

### 7. Environment Variables
Add all Firebase environment variables in Vercel:

- [ ] VITE_FIREBASE_API_KEY
- [ ] VITE_FIREBASE_AUTH_DOMAIN
- [ ] VITE_FIREBASE_DATABASE_URL
- [ ] VITE_FIREBASE_PROJECT_ID
- [ ] VITE_FIREBASE_STORAGE_BUCKET
- [ ] VITE_FIREBASE_MESSAGING_SENDER_ID
- [ ] VITE_FIREBASE_APP_ID

**Important**: Make sure to set these for all environments (Production, Preview, Development)

### 8. Deploy
- [ ] Clicked "Deploy" button
- [ ] Waited for build to complete
- [ ] Build succeeded (no errors)
- [ ] Received deployment URL (e.g., `https://your-app.vercel.app`)

### 9. Post-Deployment Testing
- [ ] Visited deployed URL
- [ ] App loads correctly
- [ ] Tested user login
- [ ] Tested submitting a suggestion
- [ ] Tested voting functionality
- [ ] Tested comments functionality
- [ ] Tested real-time sync (open app in multiple tabs/devices)
- [ ] Tested on mobile device
- [ ] Checked browser console for errors
- [ ] Verified Firebase connection is working

### 10. Domain Setup (Optional)
- [ ] Purchased/have a custom domain
- [ ] Added domain in Vercel project settings
- [ ] Updated DNS records
- [ ] SSL certificate automatically provisioned
- [ ] Tested custom domain

## Firebase Production Configuration

### 11. Security Rules (Important!)
For production, update Firebase Realtime Database rules:

- [ ] Reviewed current database rules
- [ ] Updated rules for production security
- [ ] Tested rules don't break functionality

Example production rules:
```json
{
  "rules": {
    "suggestions": {
      ".read": true,
      ".write": true,
      "$suggestionId": {
        ".validate": "newData.hasChildren(['text', 'author', 'timestamp']) && newData.child('text').isString() && newData.child('text').val().length <= 500"
      }
    }
  }
}
```

For better security with authentication:
```json
{
  "rules": {
    "suggestions": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$suggestionId": {
        ".validate": "newData.hasChildren(['text', 'author', 'timestamp'])"
      }
    }
  }
}
```

### 12. Firebase Usage Monitoring
- [ ] Set up billing alerts in Firebase
- [ ] Monitored database usage
- [ ] Checked for any suspicious activity
- [ ] Reviewed Firebase usage dashboard

## Continuous Deployment

### 13. Automatic Deployments
- [ ] Verified that pushes to main branch trigger deployments
- [ ] Tested by making a small change and pushing
- [ ] Confirmed automatic deployment succeeded
- [ ] Checked deployment logs

### 14. Preview Deployments
- [ ] Created a test branch
- [ ] Pushed changes to test branch
- [ ] Verified Vercel created preview deployment
- [ ] Tested preview URL

## Team Access

### 15. Share with Team
- [ ] Shared deployment URL with team
- [ ] Provided quick start instructions
- [ ] Explained how to use the app
- [ ] Set expectations for voting/suggestions

### 16. Documentation
- [ ] README.md is up to date
- [ ] Team has access to Firebase console (if needed)
- [ ] Team knows how to report issues

## Monitoring & Maintenance

### 17. Set Up Monitoring
- [ ] Enabled Vercel Analytics (optional)
- [ ] Set up Firebase usage alerts
- [ ] Bookmarked deployment URL
- [ ] Subscribed to Vercel deployment notifications

### 18. Backup Plan
- [ ] Documented Firebase configuration
- [ ] Stored environment variables securely
- [ ] Have access to rollback previous deployments
- [ ] Know how to export Firebase data

## Troubleshooting

If deployment fails, check:

1. **Build Errors**
   - Check Vercel build logs
   - Verify all dependencies are in package.json
   - Ensure build succeeds locally first

2. **Environment Variables**
   - Verify all variables are set in Vercel
   - Check for typos in variable names
   - Ensure values match your `.env` file

3. **Firebase Connection**
   - Verify database URL is correct
   - Check Firebase rules allow access
   - Confirm database is enabled

4. **Runtime Errors**
   - Check browser console on deployed site
   - Review Vercel function logs
   - Compare with local development

## Success Criteria

Your deployment is successful when:
- ✅ App loads at Vercel URL
- ✅ Users can enter display names
- ✅ Users can submit suggestions
- ✅ Voting works (up/down votes)
- ✅ Comments can be added
- ✅ Real-time sync works across multiple users
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Fast loading times
- ✅ Firebase connection stable

## Post-Launch

After successful deployment:

1. **Monitor for first 24 hours**
   - Watch for errors
   - Get user feedback
   - Monitor Firebase usage

2. **Gather Feedback**
   - Ask team for suggestions
   - Note any bugs or issues
   - Plan improvements

3. **Plan Updates**
   - Create issues for bugs
   - Document feature requests
   - Schedule maintenance window

## Quick Rollback

If you need to rollback:

1. Go to Vercel dashboard
2. Navigate to Deployments
3. Find previous working deployment
4. Click "..." menu → "Promote to Production"

---

**Stuck?** Check [README.md](README.md#troubleshooting) or [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md#troubleshooting)
