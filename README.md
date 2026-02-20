# Shiny Hunter Z-A

A shiny hunting companion app for Pokemon Legends: Z-A. Track your hunts, record your shinies, and get hunting tips!

## Features

- 📖 **Pokedex**: Browse all ~230 Pokemon in Z-A, filter by type, toggle shiny sprites
- 🎯 **Hunt Tracker**: Start hunts, track encounters, mark Pokemon as caught
- ✨ **My Shinies**: Gallery of all your caught shinies with stats
- 💡 **Hunt Tips**: Learn the best shiny hunting methods and strategies
- 📊 **Statistics**: View your hunting stats and progress

## Tech Stack

- **Frontend**: SvelteKit + TypeScript
- **Styling**: Tailwind CSS + DaisyUI
- **Backend**: Firebase (Auth + Firestore)
- **Deployment**: Vercel
- **Data**: PokeAPI

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repo-url>
cd shiny-hunter-app
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** > Sign-in method > Google
4. Enable **Firestore Database** (start in test mode for development)
5. Go to Project Settings > General > Your apps > Web app
6. Register a new web app and copy the config values

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Firebase config:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase credentials:

```
PUBLIC_FIREBASE_API_KEY=your_api_key
PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=your_project_id
PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 4. Firestore Security Rules

In Firebase Console, go to Firestore Database > Rules and paste:

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
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.userId);
    }
    
    match /shinies/{shinyId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.userId);
    }
  }
}
```

### 5. Run Locally

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login and Link

```bash
vercel login
vercel link
```

### 3. Set Environment Variables

```bash
vercel env add PUBLIC_FIREBASE_API_KEY
vercel env add PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add PUBLIC_FIREBASE_PROJECT_ID
vercel env add PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add PUBLIC_FIREBASE_APP_ID
```

Enter your values when prompted.

### 4. Deploy

```bash
vercel --prod
```

Or push to your Git repository with Vercel Git integration for automatic deployments.

## Project Structure

```
src/
├── lib/
│   ├── components/     # Svelte components
│   │   ├── common/     # Shared components
│   │   ├── layout/     # Layout components
│   │   ├── pokedex/    # Pokedex components
│   │   ├── hunts/      # Hunt tracker components
│   │   ├── shinies/    # Shiny gallery components
│   │   └── stats/      # Statistics components
│   ├── firebase/       # Firebase configuration
│   ├── services/       # Data services
│   ├── stores/         # Svelte stores
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── routes/             # SvelteKit routes
│   ├── pokedex/        # Pokedex page
│   ├── hunts/          # Hunt tracker page
│   ├── shinies/        # My shinies page
│   ├── tips/           # Hunt tips page
│   └── stats/          # Statistics page
```

## Mobile-First Design

The app is designed mobile-first with:
- Bottom navigation on mobile
- Responsive grid layouts
- Touch-friendly buttons (44px minimum)
- Dark mode by default

## License

MIT
