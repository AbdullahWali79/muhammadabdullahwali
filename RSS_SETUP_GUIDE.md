# RSS News Auto-Fetch Setup Guide

## Overview
This system automatically fetches technology news from multiple RSS feeds and adds them to your News section daily.

## Features
- ✅ Automatic daily fetching via Vercel Cron Jobs
- ✅ Manual fetch button in MakeNews editor
- ✅ Fetches from 8+ technology news sources
- ✅ Filters technology-related articles
- ✅ Removes duplicates automatically
- ✅ Saves to Supabase database

## RSS Feed Sources
1. **TechCrunch** - Technology news
2. **The Verge** - Technology news
3. **Wired** - Technology news
4. **Ars Technica** - Technology news
5. **Dev.to** - Development articles
6. **FreeCodeCamp** - Development articles
7. **CSS-Tricks** - Web development
8. **Smashing Magazine** - Web development

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

This will install `rss-parser` package.

### 2. Environment Variables
Make sure your Vercel project has these environment variables set:
- `VITE_SUPABASE_URL` or `REACT_APP_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` or `REACT_APP_SUPABASE_ANON_KEY`
- `CRON_SECRET` (optional, for securing cron endpoint)

### 3. Deploy to Vercel
```bash
vercel deploy
```

### 4. Verify Cron Job
After deployment, check Vercel dashboard:
- Go to your project → Settings → Cron Jobs
- You should see: `/api/cron-fetch-news` scheduled for `0 9 * * *` (9 AM daily)

## How It Works

### Automatic Daily Fetch
- Vercel Cron Job runs daily at 9 AM (UTC)
- Fetches latest articles from all RSS feeds
- Filters technology-related articles
- Saves new articles to Supabase
- Updates News section automatically

### Manual Fetch
1. Go to `/makenews` page
2. Click "Fetch RSS News" button
3. Wait for articles to be fetched
4. Articles will appear in the list

## Article Filtering
Articles are filtered based on:
- **Date**: Only articles from last 24 hours
- **Keywords**: Technology-related keywords (JavaScript, React, Python, etc.)
- **Duplicates**: Removed based on title and link

## Article Structure
Each fetched article includes:
- `id`: Unique identifier
- `title`: Article title
- `content`: Article content/snippet
- `date`: Publication date
- `category`: Technology or Development
- `image`: Article image (if available)
- `source`: RSS feed source name
- `link`: Original article URL
- `featured`: false (can be changed manually)

## Customization

### Add More RSS Feeds
Edit `api/fetch-rss-news.js`:
```javascript
const RSS_FEEDS = [
  // Add your feed here
  {
    name: 'Your Feed Name',
    url: 'https://your-feed-url.com/feed',
    category: 'Technology'
  }
];
```

### Change Cron Schedule
Edit `vercel.json`:
```json
"crons": [
  {
    "path": "/api/cron-fetch-news",
    "schedule": "0 9 * * *"  // Change this (cron format)
  }
]
```

Cron format: `minute hour day month weekday`
- `0 9 * * *` = 9 AM daily
- `0 */6 * * *` = Every 6 hours
- `0 9 * * 1` = 9 AM every Monday

### Modify Keywords Filter
Edit `api/fetch-rss-news.js`:
```javascript
const TECH_KEYWORDS = [
  // Add your keywords
  'your-keyword'
];
```

## Troubleshooting

### Cron Job Not Running
1. Check Vercel dashboard → Cron Jobs
2. Verify environment variables are set
3. Check function logs in Vercel dashboard

### No Articles Fetched
1. Check RSS feed URLs are accessible
2. Verify articles match keyword filters
3. Check function logs for errors

### API Route Not Working
1. Test manually: `https://your-domain.vercel.app/api/fetch-rss-news`
2. Check Vercel function logs
3. Verify Supabase credentials

## Manual Testing

### Test API Route Locally
```bash
# Start development server
npm start

# In another terminal, test the API
curl http://localhost:3000/api/fetch-rss-news
```

### Test in Production
Visit: `https://your-domain.vercel.app/api/fetch-rss-news`

## Notes
- Articles are limited to 50 most recent
- Only last 24 hours articles are fetched
- Duplicates are automatically removed
- Images are extracted from article content when available

## Support
If you encounter issues:
1. Check Vercel function logs
2. Verify Supabase connection
3. Test RSS feed URLs manually
4. Check browser console for errors

