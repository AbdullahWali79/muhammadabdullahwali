import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaTag } from 'react-icons/fa';
import { getNewsData } from '../services/supabaseService';
import parse from 'html-react-parser';
import './News.css';

const News = () => {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState({
    title: 'Latest News & Articles',
    subtitle: 'Stay updated with the latest trends and insights in design and development',
    articles: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Default image URL (GitHub raw URL)
  const DEFAULT_IMAGE_URL = 'https://raw.githubusercontent.com/AbdullahWali79/AbdullahImages/main/Muhammad%20Abdullah%20Ai-%20Developer.png';

  useEffect(() => {
    const loadNewsData = async () => {
      try {
        const result = await getNewsData();
        if (result.success && result.data) {
          setNewsData({
            title: result.data.title || 'Latest News & Articles',
            subtitle: result.data.subtitle || 'Stay updated with the latest trends and insights in design and development',
            articles: result.data.articles || []
          });
        }
      } catch (error) {
        console.error('Error loading news data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNewsData();
  }, []);

  const handleReadMore = (newsId) => {
    navigate(`/news/${newsId}`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  // Calculate read time from content
  const calculateReadTime = (content) => {
    if (!content) return '2 min read';
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  // Default articles if no data loaded
  const defaultNewsItems = [
    {
      id: 1,
      title: 'The Future of UI/UX Design in 2024',
      excerpt: 'Exploring the latest trends and technologies that are shaping the future of user interface and user experience design.',
      content: 'As we move further into 2024, the landscape of UI/UX design continues to evolve at a rapid pace. New technologies like AI, AR, and VR are creating unprecedented opportunities for designers to create more immersive and intuitive user experiences...',
      date: 'March 15, 2024',
      author: 'Design Team',
      category: 'Design Trends',
      readTime: '5 min read',
      image: '/api/placeholder/400/250'
    },
    {
      id: 2,
      title: 'Building Accessible Web Applications',
      excerpt: 'A comprehensive guide to creating web applications that are inclusive and accessible to all users.',
      content: 'Accessibility in web design is not just a nice-to-have feature—it\'s a fundamental requirement for creating inclusive digital experiences. In this article, we explore the key principles and techniques for building accessible web applications...',
      date: 'March 10, 2024',
      author: 'Development Team',
      category: 'Web Development',
      readTime: '7 min read',
      image: '/api/placeholder/400/250'
    },
    {
      id: 3,
      title: 'Mobile-First Design Strategy',
      excerpt: 'Why mobile-first design is crucial for modern web applications and how to implement it effectively.',
      content: 'With mobile devices accounting for over 50% of web traffic, adopting a mobile-first design strategy has become essential for creating successful digital products. This approach ensures that your application works seamlessly across all devices...',
      date: 'March 5, 2024',
      author: 'UX Team',
      category: 'Mobile Design',
      readTime: '6 min read',
      image: '/api/placeholder/400/250'
    },
    {
      id: 4,
      title: 'The Psychology of Color in Design',
      excerpt: 'Understanding how color choices impact user behavior and emotional responses in digital products.',
      content: 'Color is one of the most powerful tools in a designer\'s arsenal. It can evoke emotions, guide user attention, and create memorable experiences. In this deep dive, we explore the psychological effects of different colors and how to use them effectively...',
      date: 'February 28, 2024',
      author: 'Design Team',
      category: 'Design Psychology',
      readTime: '8 min read',
      image: '/api/placeholder/400/250'
    },
    {
      id: 5,
      title: 'Microinteractions: The Secret to Great UX',
      excerpt: 'How small animations and interactions can significantly improve user experience and engagement.',
      content: 'Microinteractions are the small, often overlooked details that make a big difference in user experience. From button hover effects to loading animations, these subtle interactions can transform a good design into a great one...',
      date: 'February 20, 2024',
      author: 'UX Team',
      category: 'User Experience',
      readTime: '4 min read',
      image: '/api/placeholder/400/250'
    },
    {
      id: 6,
      title: 'Design Systems: Building for Scale',
      excerpt: 'Creating and maintaining design systems that grow with your product and team.',
      content: 'As products and teams grow, maintaining consistency becomes increasingly challenging. Design systems provide a structured approach to scaling design across large organizations while ensuring consistency and efficiency...',
      date: 'February 15, 2024',
      author: 'Design Team',
      category: 'Design Systems',
      readTime: '9 min read',
      image: '/api/placeholder/400/250'
    }
  ];

  // Use articles from Supabase, or fallback to default
  const allNewsItems = newsData.articles.length > 0 
    ? newsData.articles.map(article => {
        // Check if article is a YouTube video (multiple checks)
        const link = article.link || '';
        const id = article.id || '';
        const source = (article.source || '').toLowerCase();
        
        const isYouTube = id.includes('youtube') || 
                         id.includes('youtube_') ||
                         link.includes('youtube.com/watch') ||
                         link.includes('youtube.com/embed') ||
                         link.includes('youtu.be/') ||
                         link.includes('youtube.com/v/') ||
                         source.includes('youtube') ||
                         source === 'youtube';
        
        // Keep original category for videos (Technology or AI)
        const category = article.category || 'General';
        
        return {
          id: article.id,
          title: article.title || 'Untitled Article',
          excerpt: article.description || article.content || '',
          content: article.fullDescription || article.content || article.description || '',
          date: formatDate(article.date || article.pubDate),
          author: article.source || 'News Team',
          category: category,
          readTime: calculateReadTime(article.content || article.description),
          image: article.image || '',
          link: article.link || '',
          isYouTube: isYouTube
        };
      })
    : defaultNewsItems;

  // Filter articles by selected category
  const newsItems = selectedCategory === 'All' 
    ? allNewsItems 
    : allNewsItems.filter(item => {
        const category = item.category || 'General';
        const isVideo = item.isYouTube || false;
        
        // Map categories for filtering
        if (selectedCategory === 'Technology' && ['Technology', 'General'].includes(category)) {
          return true;
        }
        if (selectedCategory === 'Development' && category === 'Development') {
          return true;
        }
        if (selectedCategory === 'Crypto' && category === 'Crypto') {
          return true;
        }
        if (selectedCategory === 'AI' && category === 'AI') {
          return true;
        }
        // Videos filter - show only videos from Technology and AI categories
        if (selectedCategory === 'Videos') {
          return isVideo && (category === 'Technology' || category === 'AI');
        }
        return category === selectedCategory;
      });

  // Get unique categories from articles
  const articleCategories = new Set(allNewsItems.map(item => {
    const cat = item.category || 'General';
    if (['Technology', 'General'].includes(cat)) return 'Technology';
    return cat;
  }).filter(Boolean));
  
  // Build categories array
  const categories = ['All', ...Array.from(articleCategories)];
  
  // Always add Videos filter button (will show empty if no videos)
  if (!categories.includes('Videos')) {
    categories.push('Videos');
  }
  
  // Sort categories: All first, then alphabetically, Videos at end
  categories.sort((a, b) => {
    if (a === 'All') return -1;
    if (b === 'All') return 1;
    if (a === 'Videos') return 1;
    if (b === 'Videos') return -1;
    return a.localeCompare(b);
  });

  if (loading) {
    return (
      <div className="news">
        <div className="news-container">
          <div className="loading" style={{ textAlign: 'center', padding: '40px', color: '#00CED1' }}>
            Loading news...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="news">
      <div className="news-container">
        <div className="news-header">
          <h1>{newsData.title}</h1>
          <p>{newsData.subtitle}</p>
        </div>

        {/* Filter Section */}
        <div className="news-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {newsItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#B0B0B0' }}>
            <p>No articles available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="news-grid">
            {newsItems.map((item) => (
            <article key={item.id} className="news-item">
              <div className="news-image">
                <img 
                  src={item.image || DEFAULT_IMAGE_URL} 
                  alt={item.title} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    borderRadius: '8px 8px 0 0'
                  }} 
                  onError={(e) => {
                    // If image fails to load, use default image
                    if (e.target.src !== DEFAULT_IMAGE_URL) {
                      e.target.src = DEFAULT_IMAGE_URL;
                    } else {
                      // If default image also fails, show placeholder
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }
                  }}
                />
                <div className="placeholder-image" style={{ display: 'none' }}>
                  <span>Article Image</span>
                </div>
                <div className="news-category">{item.category}</div>
              </div>
              
              <div className="news-content">
                <div className="news-meta">
                  <div className="meta-item">
                    <FaCalendarAlt className="meta-icon" />
                    <span>{item.date}</span>
                  </div>
                  <div className="meta-item">
                    <FaUser className="meta-icon" />
                    <span>{item.author}</span>
                  </div>
                  <div className="meta-item">
                    <FaTag className="meta-icon" />
                    <span>{item.readTime}</span>
                  </div>
                </div>
                
                <h2 className="news-title">{item.title}</h2>
                <div className="news-excerpt">
                  {(() => {
                    const excerpt = item.excerpt && item.excerpt.length > 0 
                      ? item.excerpt 
                      : 'No description available';
                    
                    // Check if HTML content
                    const hasHTML = /<[a-z][\s\S]*>/i.test(excerpt);
                    
                    if (hasHTML) {
                      // Strip HTML tags for excerpt and limit to 120 chars
                      const textOnly = excerpt.replace(/<[^>]*>/g, '');
                      const truncated = textOnly.length > 120 ? textOnly.substring(0, 120) + '...' : textOnly;
                      return truncated;
                    } else {
                      // Plain text - truncate to 120 chars
                      return excerpt.length > 120 ? excerpt.substring(0, 120) + '...' : excerpt;
                    }
                  })()}
                </div>
                
                <button 
                  className="read-more-btn"
                  onClick={() => handleReadMore(item.id)}
                >
                  Read More
                </button>
              </div>
            </article>
            ))}
          </div>
        )}
        
        <div className="news-cta">
          <h2>Want to stay updated?</h2>
          <p>Subscribe to our newsletter for the latest design insights and industry news.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address" />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;

