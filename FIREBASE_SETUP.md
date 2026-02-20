# Firebase Setup Guide

This guide will walk you through setting up Firebase for the Shiny Hunter Z-A app.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "shiny-hunter-za")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to **Build** > **Authentication**
2. Click "Get started"
3. Go to the **Sign-in method** tab
4. Enable **Google** sign-in:
   - Click on "Google"
   - Toggle "Enable"
   - Enter your support email
   - Click "Save"

## Step 3: Enable Firestore Database

1. Go to **Build** > **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select a location close to your users (e.g., `us-central`)
5. Click "Enable"

## Step 4: Add a Web App

1. Go to **Project Overview** (gear icon > Project settings)
2. Under "Your apps", click the **</>** icon to add a web app
3. Enter an app nickname (e.g., "shiny-hunter-web")
4. Optionally enable Firebase Hosting (not required for Vercel)
5. Click "Register app"
6. Copy the Firebase configuration object

## Step 5: Configure Environment Variables

Create a `.env.local` file in the project root with your Firebase config:

```bash
cp .env.example .env.local
```

Edit `.env.local` and replace the placeholder values with your actual Firebase config:

```
PUBLIC_FIREBASE_API_KEY=your_actual_api_key
PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=your_project_id
PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Step 6: Set Up Firestore Security Rules

1. Go to **Firestore Database** > **Rules**
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    match /hunts/{huntId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.userId);
    }
    
    match /shinies/{shinyId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.userId);
    }
  }
}
```

3. Click "Publish"

## Step 7: Create Firestore Indexes

1. Go to **Firestore Database** > **Indexes**
2. Click "Add index"
3. Create the following composite indexes:

### Index 1: Active Hunts
- Collection: `hunts`
- Fields:
  - `userId` (Ascending)
  - `status` (Ascending)
  - `lastUpdated` (Descending)

### Index 2: Completed Hunts
- Collection: `hunts`
- Fields:
  - `userId` (Ascending)
  - `status` (Ascending)
  - `startedAt` (Descending)

### Index 3: Shinies
- Collection: `shinies`
- Fields:
  - `userId` (Ascending)
  - `caughtAt` (Descending)

## Step 8: Test Locally

```bash
npm run dev
```

Visit http://localhost:5173 and sign in with Google to test.

## Step 9: Deploy to Vercel

### Using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Set environment variables
vercel env add PUBLIC_FIREBASE_API_KEY
vercel env add PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add PUBLIC_FIREBASE_PROJECT_ID
vercel env add PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add PUBLIC_FIREBASE_APP_ID

# Deploy
vercel --prod
```

### Using Git Integration:

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure environment variables in the Vercel dashboard:
   - Go to Project Settings > Environment Variables
   - Add all the `PUBLIC_FIREBASE_*` variables
6. Deploy!

## Troubleshooting

### "Permission denied" errors
- Check that your Firestore rules are published
- Ensure you're signed in
- Verify the userId in your documents matches the authenticated user

### "Missing or insufficient permissions"
- Make sure you've created the required Firestore indexes
- Check that your security rules allow the operation

### Build errors
- Ensure all environment variables are set
- Check that `.env.local` exists with valid values

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Vercel Documentation](https://vercel.com/docs)
