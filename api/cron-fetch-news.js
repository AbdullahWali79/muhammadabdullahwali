// This is a Vercel Cron Job endpoint
// It will be called automatically by Vercel based on cron schedule

const fetchRSSNews = require('./fetch-rss-news');

module.exports = async (req, res) => {
  // Verify it's a cron request (optional security check)
  const authHeader = req.headers.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Call the RSS fetch function
  return fetchRSSNews(req, res);
};

