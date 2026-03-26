# YouTube Videos Integration - Setup Guide

## ✅ Kya Kiya Gaya

YouTube videos ko news articles ki tarah fetch karne ke liye YouTube Data API v3 integrate kiya gaya hai.

## 🎯 Features

1. **Last Week Ke Videos**: Sirf pichle 7 dino mein upload kiye gaye videos
2. **Tech Videos**: Technology, Programming, Web Development, AI, ML related videos
3. **YouTube Thumbnail**: High quality thumbnail images
4. **Video Title**: Article title ki jagah video title
5. **Video Description**: Article content ki jagah video description
6. **Direct Link**: YouTube video ka direct link

## 📋 Requirements

### YouTube Data API v3 Key Chahiye

**Free Tier Available:**
- 10,000 units per day
- Search operation: 100 units per request
- ~100 searches per day possible

## 🔧 Setup Instructions

### Step 1: YouTube API Key Banayein

1. **Google Cloud Console** mein jayein:
   - https://console.cloud.google.com/

2. **New Project** banayein:
   - Project name: "News Fetcher" (ya kuch bhi)
   - Create project

3. **YouTube Data API v3 Enable** karein:
   - APIs & Services > Library
   - "YouTube Data API v3" search karein
   - Enable karein

4. **API Key Create** karein:
   - APIs & Services > Credentials
   - "Create Credentials" > "API Key"
   - API key copy karein

### Step 2: Environment Variable Add Karein

**Vercel/Production:**
```env
YOUTUBE_API_KEY=your_youtube_api_key_here
```

**Local Development (.env file):**
```env
YOUTUBE_API_KEY=your_youtube_api_key_here
```

## 🎬 How It Works

### Video Fetching Process:

1. **Search Queries**: 
   - "technology"
   - "programming"
   - "web development"
   - (3 queries use hote hain quota save karne ke liye)

2. **Date Filter**: 
   - Sirf last 7 dino ke videos
   - `publishedAfter` parameter use

3. **Video Details**:
   - Search se video IDs milte hain
   - Video details API se full description fetch
   - High quality thumbnail extract

4. **Data Format**:
   ```javascript
   {
     id: "youtube_videoId_timestamp",
     title: "Video Title",           // Article title
     description: "Video description", // Article content
     image: "thumbnail_url",          // High quality thumbnail
     link: "https://youtube.com/watch?v=...", // Direct link
     category: "Technology",
     source: "Channel Name",
     videoId: "video_id",
     channelTitle: "Channel Name"
   }
   ```

## 📊 Quota Management

**Daily Quota**: 10,000 units

**Operations Cost**:
- Search: 100 units per request
- Video details: 1 unit per video

**Current Usage**:
- 3 search queries × 100 = 300 units
- ~30 videos × 1 = 30 units
- **Total**: ~330 units per fetch
- **Daily Capacity**: ~30 fetches per day

## 🔍 Search Queries

Currently 3 queries use ho rahe hain:
1. "technology"
2. "programming"  
3. "web development"

Agar aur queries chahiye, to `fetchYouTubeVideos()` function mein add kar sakte hain.

## ⚙️ Configuration

### Video Limit:
- Maximum 20 unique videos per fetch
- Duplicate videos automatically remove

### Date Range:
- Last 7 days (1 week)
- `publishedAfter` parameter automatically calculate

### Thumbnail Quality:
Priority order:
1. `high` quality (480x360)
2. `medium` quality (320x180)
3. `default` quality (120x90)

## 🚀 Usage

### Automatic:
Jab `/api/fetch-rss-news` call hota hai, YouTube videos automatically fetch ho jate hain (agar API key set hai).

### Manual:
```javascript
const videos = await fetchYouTubeVideos();
```

## ⚠️ Important Notes

1. **API Key Required**: Agar key nahi hai, to YouTube videos skip ho jayenge (error nahi aayega)

2. **Quota Limit**: Daily quota exceed na ho, isliye:
   - Sirf 3 queries use kiye gaye hain
   - Maximum 20 videos per fetch
   - Rate limiting delays add kiye gaye hain

3. **Error Handling**: Agar YouTube API fail ho, to baaki sources se news fetch hota rahega

4. **Video Links**: Har article mein direct YouTube link hai - click karne par video open hoga

## 📝 Example Response

```json
{
  "id": "youtube_dQw4w9WgXcQ_1234567890",
  "title": "How to Build a React App",
  "description": "Learn how to build a modern React application...",
  "image": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  "link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "category": "Technology",
  "source": "Tech Channel",
  "date": "2024-12-01"
}
```

## 🎯 Result

Ab aapke news section mein:
- ✅ **RSS Feeds** - News articles
- ✅ **CryptoCompare** - Crypto news
- ✅ **NewsAPI** - General news
- ✅ **Reddit** - Community posts
- ✅ **YouTube** - Tech videos (last week) 🆕

---

**Status**: ✅ Complete
**API**: YouTube Data API v3
**Free Tier**: 10,000 units/day
**Setup Required**: API Key

