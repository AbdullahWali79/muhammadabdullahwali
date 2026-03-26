const Parser = require('rss-parser');
const { createClient } = require('@supabase/supabase-js');

// Initialize RSS Parser
const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: true }],
      ['content:encoded', 'contentEncoded'],
    ]
  }
});

// RSS Feed Sources
const RSS_FEEDS = [
  // Technology Feeds
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'Technology'
  },
  {
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'Technology'
  },
  {
    name: 'Wired',
    url: 'https://www.wired.com/feed/rss',
    category: 'Technology'
  },
  {
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'Technology'
  },
  {
    name: 'Dev.to',
    url: 'https://dev.to/feed',
    category: 'Development'
  },
  {
    name: 'FreeCodeCamp',
    url: 'https://www.freecodecamp.org/news/rss/',
    category: 'Development'
  },
  {
    name: 'CSS-Tricks',
    url: 'https://css-tricks.com/feed/',
    category: 'Development'
  },
  {
    name: 'Smashing Magazine',
    url: 'https://www.smashingmagazine.com/feed/',
    category: 'Development'
  },
  // Crypto News Feeds
  {
    name: 'CoinDesk',
    url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    category: 'Crypto'
  },
  {
    name: 'CoinTelegraph',
    url: 'https://cointelegraph.com/rss',
    category: 'Crypto'
  },
  {
    name: 'CryptoSlate',
    url: 'https://cryptoslate.com/feed/',
    category: 'Crypto'
  },
  {
    name: 'Decrypt',
    url: 'https://decrypt.co/feed',
    category: 'Crypto'
  },
  {
    name: 'Bitcoin Magazine',
    url: 'https://bitcoinmagazine.com/.rss/full/',
    category: 'Crypto'
  },
  {
    name: 'The Block',
    url: 'https://www.theblock.co/rss.xml',
    category: 'Crypto'
  },
  // AI News & Tools Feeds
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
    category: 'AI'
  },
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/tag/artificial-intelligence/feed/',
    category: 'AI'
  },
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/ai/feed/',
    category: 'AI'
  },
  {
    name: 'AI News',
    url: 'https://www.artificialintelligence-news.com/feed/',
    category: 'AI'
  },
  {
    name: 'Towards Data Science',
    url: 'https://towardsdatascience.com/feed',
    category: 'AI'
  },
  {
    name: 'There\'s An AI For That',
    url: 'https://theresanaiforthat.com/feed/',
    category: 'AI'
  }
];

// Technology keywords to filter articles
const TECH_KEYWORDS = [
  // General Tech
  'javascript', 'react', 'node', 'python', 'java', 'web development',
  'programming', 'coding', 'software', 'app development', 'mobile app',
  'flutter', 'react native', 'vue', 'angular', 'typescript', 'html', 'css',
  'api', 'database', 'cloud', 'aws', 'azure', 'docker', 'kubernetes',
  'cybersecurity', 'devops', 'git', 'github',
  // AI & Machine Learning
  'machine learning', 'ai', 'artificial intelligence', 'data science',
  'deep learning', 'neural network', 'chatgpt', 'openai', 'gpt', 'llm',
  'large language model', 'generative ai', 'ml', 'nlp', 'computer vision',
  'ai tool', 'ai tools', 'automation', 'robotics', 'ai model',
  // Crypto & Blockchain
  'blockchain', 'crypto', 'cryptocurrency', 'bitcoin', 'btc', 'ethereum',
  'eth', 'defi', 'nft', 'web3', 'altcoin', 'trading', 'wallet', 'mining',
  'smart contract', 'dapp', 'dao', 'token', 'coin', 'exchange', 'binance',
  'crypto market', 'digital currency', 'stablecoin', 'metaverse'
];

// Validate and clean image URL
function validateImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  
  // Remove whitespace
  url = url.trim();
  
  // Check if it's a valid HTTP/HTTPS URL
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return '';
  }
  
  // Remove common invalid URLs
  const invalidPatterns = [
    'placeholder',
    'default',
    'none',
    'null',
    'undefined',
    'data:image',
    'about:blank'
  ];
  
  const urlLower = url.toLowerCase();
  if (invalidPatterns.some(pattern => urlLower.includes(pattern))) {
    return '';
  }
  
  // Check for valid image extensions
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const hasExtension = validExtensions.some(ext => urlLower.includes(ext));
  
  // If no extension, still allow if it looks like an image URL (has /image/ or similar)
  if (!hasExtension && !urlLower.includes('/image') && !urlLower.includes('/img') && !urlLower.includes('/photo')) {
    // Still allow it, might be a CDN URL without extension
  }
  
  return url;
}

// Extract image from article content (RSS feeds)
function extractImage(item) {
  let imageUrl = '';
  
  // Try media:content first
  if (item.mediaContent && item.mediaContent.length > 0) {
    const media = item.mediaContent.find(m => m.$ && m.$.url);
    if (media && media.$.url) {
      imageUrl = validateImageUrl(media.$.url);
      if (imageUrl) return imageUrl;
    }
  }
  
  // Try media:thumbnail
  if (item.mediaThumbnail && item.mediaThumbnail.length > 0) {
    const thumb = item.mediaThumbnail.find(t => t.$ && t.$.url);
    if (thumb && thumb.$.url) {
      imageUrl = validateImageUrl(thumb.$.url);
      if (imageUrl) return imageUrl;
    }
  }
  
  // Try content:encoded for img tags (multiple patterns)
  if (item.contentEncoded) {
    // Try src="..." pattern
    let imgMatch = item.contentEncoded.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (!imgMatch) {
      // Try src=... pattern (without quotes)
      imgMatch = item.contentEncoded.match(/<img[^>]+src=([^\s>]+)/i);
    }
    if (imgMatch && imgMatch[1]) {
      imageUrl = validateImageUrl(imgMatch[1]);
      if (imageUrl) return imageUrl;
    }
  }
  
  // Try content for img tags
  if (item.content) {
    let imgMatch = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (!imgMatch) {
      imgMatch = item.content.match(/<img[^>]+src=([^\s>]+)/i);
    }
    if (imgMatch && imgMatch[1]) {
      imageUrl = validateImageUrl(imgMatch[1]);
      if (imageUrl) return imageUrl;
    }
  }
  
  // Try contentSnippet for img tags
  if (item.contentSnippet) {
    let imgMatch = item.contentSnippet.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (!imgMatch) {
      imgMatch = item.contentSnippet.match(/<img[^>]+src=([^\s>]+)/i);
    }
    if (imgMatch && imgMatch[1]) {
      imageUrl = validateImageUrl(imgMatch[1]);
      if (imageUrl) return imageUrl;
    }
  }
  
  // Try description for img tags
  if (item.description) {
    let imgMatch = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (!imgMatch) {
      imgMatch = item.description.match(/<img[^>]+src=([^\s>]+)/i);
    }
    if (imgMatch && imgMatch[1]) {
      imageUrl = validateImageUrl(imgMatch[1]);
      if (imageUrl) return imageUrl;
    }
  }
  
  // Try enclosure (usually for podcasts, but sometimes images)
  if (item.enclosure && item.enclosure.url) {
    imageUrl = validateImageUrl(item.enclosure.url);
    if (imageUrl) return imageUrl;
  }
  
  // Try itunes:image
  if (item.itunes && item.itunes.image) {
    imageUrl = validateImageUrl(item.itunes.image);
    if (imageUrl) return imageUrl;
  }
  
  return '';
}

// Clean HTML from text (for short descriptions only)
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

// Preserve HTML content (for full descriptions)
function preserveHTML(text) {
  if (!text) return '';
  // Keep HTML structure intact, only decode entities
  // Don't remove HTML tags - preserve them for rendering
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—');
}

// Check if article is technology-related (includes crypto and AI)
function isTechRelated(title, content) {
  const text = (title + ' ' + content).toLowerCase();
  // For crypto and AI feeds, accept all articles since they're already filtered by source
  // For other feeds, filter by keywords
  return TECH_KEYWORDS.some(keyword => text.includes(keyword));
}

// Check if feed should skip keyword filtering (crypto and AI feeds are already curated)
function shouldSkipFiltering(category) {
  return category === 'Crypto' || category === 'AI';
}

// Fetch news from CryptoCompare API (Free - 100K calls/month)
async function fetchCryptoCompareNews() {
  try {
    console.log('Fetching CryptoCompare news...');
    const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
    const data = await response.json();
    
    if (data.Response === 'Success' && data.Data) {
      const articles = data.Data
        .filter(item => {
          // Filter only recent articles (last 24 hours)
          const pubDate = item.published_on ? new Date(item.published_on * 1000) : new Date();
          const hoursAgo = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60);
          return hoursAgo <= 24;
        })
        .slice(0, 10) // Limit to 10 articles
        .map(item => {
          const pubDate = item.published_on ? new Date(item.published_on * 1000) : new Date();
          
          // Extract and validate image URL from CryptoCompare
          let imageUrl = '';
          if (item.imageurl) {
            imageUrl = validateImageUrl(item.imageurl);
          }
          if (!imageUrl && item.source_info && item.source_info.img) {
            imageUrl = validateImageUrl(item.source_info.img);
          }
          if (!imageUrl && item.imageurl) {
            // Try direct URL even if validation fails (might be valid)
            imageUrl = item.imageurl.startsWith('http') ? item.imageurl : '';
          }
          
          return {
            id: `crypto_${item.id}_${Date.now()}`,
            title: item.title || 'Untitled Article',
            description: cleanText(item.body || item.title || ''),
            fullDescription: cleanText(item.body || item.title || ''),
            content: cleanText(item.body || item.title || ''),
            date: pubDate.toISOString().split('T')[0],
            category: 'Crypto',
            image: imageUrl,
            featured: false,
            source: item.source_info?.name || 'CryptoCompare',
            link: item.url || item.guid || '',
            pubDate: pubDate.toISOString()
          };
        });
      
      console.log(`Found ${articles.length} articles from CryptoCompare`);
      return articles;
    }
    return [];
  } catch (error) {
    console.error('Error fetching CryptoCompare news:', error.message);
    return [];
  }
}

// Fetch news from NewsAPI (Free tier - requires API key, but we'll try without first)
async function fetchNewsAPI(category = 'technology') {
  try {
    const apiKey = process.env.NEWS_API_KEY || '';
    if (!apiKey) {
      console.log('NewsAPI key not found, skipping...');
      return [];
    }
    
    console.log(`Fetching NewsAPI for ${category}...`);
    const query = category === 'crypto' ? 'cryptocurrency' : 
                  category === 'ai' ? 'artificial intelligence' : 
                  'technology';
    
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`
    );
    const data = await response.json();
    
    if (data.status === 'ok' && data.articles) {
      const articles = data.articles
        .filter(item => {
          // Filter only recent articles (last 24 hours)
          const pubDate = item.publishedAt ? new Date(item.publishedAt) : new Date();
          const hoursAgo = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60);
          return hoursAgo <= 24;
        })
        .map(item => {
          const pubDate = item.publishedAt ? new Date(item.publishedAt) : new Date();
          
          // Extract and validate image URL from NewsAPI
          const imageUrl = validateImageUrl(item.urlToImage || '');
          
          return {
            id: `newsapi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: item.title || 'Untitled Article',
            description: cleanText(item.description || item.title || ''),
            fullDescription: cleanText(item.content || item.description || item.title || ''),
            content: cleanText(item.description || item.title || ''),
            date: pubDate.toISOString().split('T')[0],
            category: category === 'crypto' ? 'Crypto' : category === 'ai' ? 'AI' : 'Technology',
            image: imageUrl,
            featured: false,
            source: item.source?.name || 'NewsAPI',
            link: item.url || '',
            pubDate: pubDate.toISOString()
          };
        });
      
      console.log(`Found ${articles.length} articles from NewsAPI (${category})`);
      return articles;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching NewsAPI (${category}):`, error.message);
    return [];
  }
}

// Fetch YouTube videos (Free tier - 10,000 units/day, search costs 100 units)
async function fetchYouTubeVideos() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY || '';
    if (!apiKey) {
      console.log('YouTube API key not found, skipping...');
      return [];
    }
    
    console.log('Fetching YouTube tech videos from last week...');
    
    // Calculate last week's date
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const publishedAfter = oneWeekAgo.toISOString();
    
    // Tech-related search queries
    const searchQueries = [
      'technology',
      'programming',
      'web development',
      'artificial intelligence',
      'machine learning',
      'software development'
    ];
    
    const allVideos = [];
    
    // Fetch videos for each query (limit to 2-3 queries to stay within quota)
    for (const query of searchQueries.slice(0, 3)) {
      try {
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
          `part=snippet&` +
          `q=${encodeURIComponent(query)}&` +
          `type=video&` +
          `publishedAfter=${publishedAfter}&` +
          `maxResults=10&` +
          `order=date&` +
          `key=${apiKey}`;
        
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
          // Get video details for better description
          const videoIds = data.items.map(item => item.id.videoId).join(',');
          
          let videoDetails = {};
          try {
            const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?` +
              `part=snippet,contentDetails&` +
              `id=${videoIds}&` +
              `key=${apiKey}`;
            
            const detailsResponse = await fetch(detailsUrl);
            const detailsData = await detailsResponse.json();
            
            if (detailsData.items) {
              detailsData.items.forEach(video => {
                videoDetails[video.id] = video.snippet;
              });
            }
          } catch (detailsError) {
            console.error('Error fetching video details:', detailsError.message);
          }
          
          const videos = data.items
            .filter(item => {
              // Filter only videos from last week
              const pubDate = item.snippet.publishedAt ? new Date(item.snippet.publishedAt) : new Date();
              const daysAgo = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60 * 24);
              return daysAgo <= 7;
            })
            .map(item => {
              const videoId = item.id.videoId;
              const snippet = item.snippet;
              const details = videoDetails[videoId] || snippet;
              
              // Get best quality thumbnail
              const thumbnail = details.thumbnails?.high?.url || 
                               details.thumbnails?.medium?.url || 
                               details.thumbnails?.default?.url || 
                               '';
              
              const pubDate = new Date(snippet.publishedAt);
              
              return {
                id: `youtube_${videoId}_${Date.now()}`,
                title: snippet.title || 'Untitled Video',
                description: cleanText(details.description || snippet.description || snippet.title || ''),
                fullDescription: cleanText(details.description || snippet.description || snippet.title || ''),
                content: cleanText(details.description || snippet.description || snippet.title || '').substring(0, 300),
                date: pubDate.toISOString().split('T')[0],
                category: 'Technology',
                image: validateImageUrl(thumbnail),
                featured: false,
                source: snippet.channelTitle || 'YouTube',
                link: `https://www.youtube.com/watch?v=${videoId}`,
                pubDate: pubDate.toISOString(),
                videoId: videoId,
                channelTitle: snippet.channelTitle || ''
              };
            });
          
          allVideos.push(...videos);
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (queryError) {
        console.error(`Error fetching YouTube videos for query "${query}":`, queryError.message);
        // Continue with other queries
      }
    }
    
    // Remove duplicates based on videoId
    const uniqueVideos = [];
    const seenVideoIds = new Set();
    
    allVideos.forEach(video => {
      if (video.videoId && !seenVideoIds.has(video.videoId)) {
        seenVideoIds.add(video.videoId);
        uniqueVideos.push(video);
      }
    });
    
    console.log(`Found ${uniqueVideos.length} unique YouTube videos from last week`);
    return uniqueVideos.slice(0, 20); // Limit to 20 videos
    
  } catch (error) {
    console.error('Error fetching YouTube videos:', error.message);
    return [];
  }
}

// Fetch Reddit posts (Free - 60 requests/minute)
async function fetchRedditNews(subreddit, category) {
  try {
    console.log(`Fetching Reddit r/${subreddit}...`);
    const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=10`);
    const data = await response.json();
    
    if (data.data && data.data.children) {
      const articles = data.data.children
        .filter(item => {
          const post = item.data;
          // Filter only recent posts (last 24 hours)
          const pubDate = post.created_utc ? new Date(post.created_utc * 1000) : new Date();
          const hoursAgo = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60);
          return hoursAgo <= 24 && !post.stickied;
        })
        .slice(0, 5)
        .map(item => {
          const post = item.data;
          const pubDate = post.created_utc ? new Date(post.created_utc * 1000) : new Date();
          
          // Extract and validate image URL from Reddit
          let imageUrl = '';
          
          // Try preview images first (best quality)
          if (post.preview && post.preview.images && post.preview.images.length > 0) {
            const previewImg = post.preview.images[0];
            if (previewImg.source && previewImg.source.url) {
              // Reddit preview URLs are encoded, decode them
              imageUrl = previewImg.source.url.replace(/&amp;/g, '&');
              imageUrl = validateImageUrl(imageUrl);
            }
          }
          
          // Try thumbnail_hint (medium quality)
          if (!imageUrl && post.thumbnail_hint) {
            imageUrl = validateImageUrl(post.thumbnail_hint);
          }
          
          // Try thumbnail (low quality, but better than nothing)
          if (!imageUrl && post.thumbnail && post.thumbnail.startsWith('http')) {
            imageUrl = validateImageUrl(post.thumbnail);
          }
          
          // Try url if it's an image post
          if (!imageUrl && post.url && (post.url.includes('.jpg') || post.url.includes('.png') || post.url.includes('.gif') || post.url.includes('.webp'))) {
            imageUrl = validateImageUrl(post.url);
          }
          
          return {
            id: `reddit_${post.id}_${Date.now()}`,
            title: post.title || 'Untitled Post',
            description: cleanText(post.selftext || post.title || '').substring(0, 200),
            fullDescription: cleanText(post.selftext || post.title || ''),
            content: cleanText(post.selftext || post.title || '').substring(0, 200),
            date: pubDate.toISOString().split('T')[0],
            category: category,
            image: imageUrl,
            featured: false,
            source: `Reddit r/${subreddit}`,
            link: `https://www.reddit.com${post.permalink}`,
            pubDate: pubDate.toISOString()
          };
        });
      
      console.log(`Found ${articles.length} articles from Reddit r/${subreddit}`);
      return articles;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching Reddit r/${subreddit}:`, error.message);
    return [];
  }
}

// Fetch and parse RSS feed
async function fetchRSSFeed(feedConfig) {
  try {
    console.log(`Fetching ${feedConfig.name}...`);
    const feed = await parser.parseURL(feedConfig.url);
    
    const articles = feed.items
      .filter(item => {
        // Filter only recent articles (last 24 hours)
        const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
        const hoursAgo = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60);
        return hoursAgo <= 24;
      })
      .filter(item => {
        // For crypto and AI feeds, skip keyword filtering (they're already curated)
        // For other feeds, filter technology-related articles
        if (shouldSkipFiltering(feedConfig.category)) {
          return true; // Accept all articles from crypto/AI feeds
        }
        const title = item.title || '';
        const content = item.contentSnippet || item.content || '';
        return isTechRelated(title, content);
      })
      .slice(0, 5) // Limit to 5 articles per feed
      .map(item => {
        const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
        
        // Get content - prioritize contentEncoded (full HTML) for fullDescription
        const rawContent = item.content || item.contentSnippet || item.description || '';
        const htmlContent = item.contentEncoded || item.content || item.contentSnippet || item.description || '';
        
        // Short description (clean text for card view)
        const shortDescription = cleanText(rawContent);
        
        // Full description (preserve HTML for detail page)
        // Use contentEncoded if available (full HTML), otherwise preserve HTML from content
        const fullDescription = item.contentEncoded 
          ? preserveHTML(item.contentEncoded) 
          : preserveHTML(htmlContent);
        
        return {
          id: `rss_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: item.title || 'Untitled Article',
          description: shortDescription, // Clean text for card view
          fullDescription: fullDescription, // HTML preserved for detail page
          content: shortDescription, // Fallback
          date: pubDate.toISOString().split('T')[0],
          category: feedConfig.category,
          image: extractImage(item) || '',
          featured: false,
          source: feedConfig.name,
          link: item.link || '',
          pubDate: pubDate.toISOString()
        };
      });
    
    console.log(`Found ${articles.length} articles from ${feedConfig.name}`);
    return articles;
  } catch (error) {
    console.error(`Error fetching ${feedConfig.name}:`, error.message);
    return [];
  }
}

// Main handler function
// Version: 2.0 - Fixed Supabase credentials with fallback
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('RSS Fetch API called - Version 2.0');

  try {
    // Initialize Supabase with hardcoded credentials (fallback always available)
    const supabaseUrl = process.env.VITE_SUPABASE_URL 
      || process.env.REACT_APP_SUPABASE_URL
      || process.env.SUPABASE_URL
      || 'https://qnwtztkfeejxfulvvyfi.supabase.co';
    
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY 
      || process.env.REACT_APP_SUPABASE_ANON_KEY
      || process.env.SUPABASE_ANON_KEY
      || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFud3R6dGtmZWVqeGZ1bHZ2eWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODI1MzUsImV4cCI6MjA3Nzc1ODUzNX0.FjhiD2TK3M4ZfayGOa2tXDPIrUIQXyiMgutA0g512jI';

    // Verify credentials are set (should always be true due to fallback)
    if (!supabaseUrl || !supabaseKey) {
      console.error('CRITICAL: Supabase credentials are missing even with fallback!');
      return res.status(500).json({
        success: false,
        error: 'Configuration error: Supabase credentials missing'
      });
    }

    console.log('Initializing Supabase client with URL:', supabaseUrl.substring(0, 30) + '...');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all RSS feeds and REST APIs
    console.log('Starting news fetch from all sources...');
    const allArticles = [];
    
    try {
      // Fetch RSS feeds
      for (const feed of RSS_FEEDS) {
        try {
          const articles = await fetchRSSFeed(feed);
          allArticles.push(...articles);
          console.log(`Fetched ${articles.length} articles from ${feed.name}`);
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (feedError) {
          console.error(`Error fetching feed ${feed.name}:`, feedError.message);
          // Continue with other feeds even if one fails
        }
      }

      // Fetch from CryptoCompare API (Free - no API key needed)
      try {
        const cryptoArticles = await fetchCryptoCompareNews();
        allArticles.push(...cryptoArticles);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error fetching CryptoCompare:', error.message);
      }

      // Fetch from NewsAPI (if API key is available)
      try {
        const techArticles = await fetchNewsAPI('technology');
        allArticles.push(...techArticles);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error fetching NewsAPI technology:', error.message);
      }

      try {
        const cryptoNewsAPI = await fetchNewsAPI('crypto');
        allArticles.push(...cryptoNewsAPI);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error fetching NewsAPI crypto:', error.message);
      }

      try {
        const aiNewsAPI = await fetchNewsAPI('ai');
        allArticles.push(...aiNewsAPI);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error fetching NewsAPI AI:', error.message);
      }

      // Fetch from Reddit (Free - no API key needed)
      try {
        const redditCrypto = await fetchRedditNews('cryptocurrency', 'Crypto');
        allArticles.push(...redditCrypto);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error fetching Reddit crypto:', error.message);
      }

      try {
        const redditAI = await fetchRedditNews('artificial', 'AI');
        allArticles.push(...redditAI);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error fetching Reddit AI:', error.message);
      }

      try {
        const redditML = await fetchRedditNews('MachineLearning', 'AI');
        allArticles.push(...redditML);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error fetching Reddit ML:', error.message);
      }

      // Fetch from YouTube (Free tier - requires API key)
      try {
        const youtubeVideos = await fetchYouTubeVideos();
        allArticles.push(...youtubeVideos);
        console.log(`Fetched ${youtubeVideos.length} YouTube videos`);
      } catch (error) {
        console.error('Error fetching YouTube videos:', error.message);
      }

    } catch (fetchError) {
      console.error('Error in news fetch loop:', fetchError);
      return res.status(500).json({
        success: false,
        error: `Error fetching news: ${fetchError.message}`
      });
    }

    console.log(`Total articles fetched: ${allArticles.length}`);

    if (allArticles.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No new articles found',
        articlesCount: 0
      });
    }

    // Get existing news data
    const { data: existingData, error: fetchError } = await supabase
      .from('news_data')
      .select('*')
      .eq('id', 1)
      .single();

    let existingArticles = [];
    if (existingData && existingData.articles) {
      existingArticles = Array.isArray(existingData.articles) 
        ? existingData.articles 
        : [];
    }

    // Remove duplicates based on title and link
    const existingTitles = new Set(existingArticles.map(a => a.title?.toLowerCase()));
    const existingLinks = new Set(existingArticles.map(a => a.link).filter(Boolean));
    
    const newArticles = allArticles.filter(article => {
      const titleLower = article.title?.toLowerCase();
      return !existingTitles.has(titleLower) && 
             (!article.link || !existingLinks.has(article.link));
    });

    console.log(`New unique articles: ${newArticles.length}`);

    if (newArticles.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No new unique articles to add',
        articlesCount: 0
      });
    }

    // Merge new articles with existing ones (new articles first)
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    // Filter out articles older than 1 month
    const recentExistingArticles = existingArticles.filter(article => {
      const articleDate = new Date(article.pubDate || article.date || 0);
      return articleDate >= oneMonthAgo;
    });
    
    console.log(`Removed ${existingArticles.length - recentExistingArticles.length} old articles (older than 1 month)`);
    
    const updatedArticles = [...newArticles, ...recentExistingArticles]
      .sort((a, b) => {
        // Sort by date, newest first
        const dateA = new Date(a.pubDate || a.date || 0);
        const dateB = new Date(b.pubDate || b.date || 0);
        return dateB - dateA;
      })
      .slice(0, 100); // Keep only latest 100 articles (increased from 50)

    // Update news data
    const newsData = {
      title: existingData?.title || 'Latest News',
      subtitle: existingData?.subtitle || 'Stay updated with technology news',
      articles: updatedArticles
    };

    const { error: updateError } = await supabase
      .from('news_data')
      .upsert([{ id: 1, ...newsData }], { onConflict: 'id' });

    if (updateError) {
      console.error('Error updating news data:', updateError);
      return res.status(500).json({
        success: false,
        error: updateError.message
      });
    }

    console.log(`Successfully added ${newArticles.length} new articles`);

    return res.status(200).json({
      success: true,
      message: `Successfully fetched and added ${newArticles.length} new articles`,
      articlesCount: newArticles.length,
      totalArticles: updatedArticles.length
    });

  } catch (error) {
    console.error('Error in fetch-rss-news:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

