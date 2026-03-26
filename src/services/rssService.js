// RSS Feed Service for fetching news articles
// This service provides functions to manually trigger RSS fetching

/**
 * Manually trigger RSS feed fetch
 * @returns {Promise<{success: boolean, message: string, articlesCount: number}>}
 */
export const fetchRSSNews = async () => {
  try {
    // Get the API URL (works for both development and production)
    // For Vercel, use the current origin
    const apiUrl = `${window.location.origin}/api/fetch-rss-news`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching RSS news:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch RSS news'
    };
  }
};

/**
 * Get RSS feed sources list
 */
export const getRSSFeedSources = () => {
  return [
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
    }
  ];
};

