# Vercel Deployment Guide

## Quick Deploy

### Option 1: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Link your project (first time only)
cd shiny-hunter-app
vercel link

# Set environment variables
vercel env add PUBLIC_FIREBASE_API_KEY
vercel env add PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add PUBLIC_FIREBASE_PROJECT_ID
vercel env add PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add PUBLIC_FIREBASE_APP_ID

# Deploy to production
vercel --prod
```

### Option 2: Git Integration (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New..." > "Project"
4. Import your repository
5. Configure:
   - Framework Preset: SvelteKit
   - Build Command: `npm run build`
   - Output Directory: `.svelte-kit/output`
6. Add Environment Variables (see below)
7. Click "Deploy"

## Environment Variables

Add these environment variables in the Vercel dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `PUBLIC_FIREBASE_API_KEY` | Firebase API Key | `AIzaSyB...` |
| `PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `myapp.firebaseapp.com` |
| `PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | `myapp-12345` |
| `PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage | `myapp-12345.appspot.com` |
| `PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Sender ID | `123456789` |
| `PUBLIC_FIREBASE_APP_ID` | Firebase App ID | `1:123456789:web:abc...` |

### Setting Environment Variables via CLI

```bash
vercel env add PUBLIC_FIREBASE_API_KEY production
# Enter your API key when prompted

vercel env add PUBLIC_FIREBASE_AUTH_DOMAIN production
# Enter: your-project.firebaseapp.com

# Repeat for all variables...
```

## Build Configuration

The `vercel.json` file in the project root configures the build:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".svelte-kit/output",
  "framework": "sveltekit",
  "installCommand": "npm ci",
  "regions": ["iad1"]
}
```

## Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click "Settings" > "Domains"
3. Enter your domain name
4. Follow the DNS configuration instructions

## Continuous Deployment

With Git integration, Vercel automatically deploys when you push to:
- `main` branch → Production
- Other branches → Preview deployments

## Troubleshooting

### Build Failures

1. Check that all environment variables are set
2. Verify `npm run build` works locally
3. Check the build logs in Vercel Dashboard

### Runtime Errors

1. Check browser console for errors
2. Verify Firebase configuration is correct
3. Ensure Firestore rules allow the operations

### 404 Errors

SvelteKit handles routing, but if you see 404s:
1. Check that `svelte.config.js` uses `@sveltejs/adapter-vercel`
2. Verify all routes exist in `src/routes/`

## Performance Optimization

### Caching

The app includes caching headers for the Pokemon API:
```json
{
  "headers": [
    {
      "source": "/api/pokemon",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=86400" }
      ]
    }
  ]
}
```

### Image Optimization

Pokemon sprites are loaded directly from PokeAPI with lazy loading.

## Monitoring

- Use Vercel Analytics for performance metrics
- Check the Functions tab for serverless function logs
- Monitor Firebase console for database usage

## Rollback

If you need to rollback:
1. Go to Vercel Dashboard > Deployments
2. Find the previous working deployment
3. Click the three dots > "Promote to Production"

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [SvelteKit on Vercel](https://vercel.com/docs/frameworks/sveltekit)
- [Firebase Documentation](https://firebase.google.com/docs)
