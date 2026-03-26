import React, { useState, useEffect } from 'react';
import PasswordProtection from './PasswordProtection';
import GitHubImagePicker from './GitHubImagePicker';
import { FaSave, FaEye, FaPlus, FaTrash, FaSync } from 'react-icons/fa';
import { saveNewsData, getNewsData } from '../services/supabaseService';
import { fetchRSSNews } from '../services/rssService';
import './MakeNews.css';

const MakeNews = () => {
  const [newsData, setNewsData] = useState({
    title: 'Latest News',
    subtitle: 'Stay updated with my latest work',
    articles: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchingRSS, setFetchingRSS] = useState(false);
  const [message, setMessage] = useState('');

  // Load data from database on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await getNewsData();
        if (result.success && result.data) {
          setNewsData({
            title: result.data.title || 'Latest News',
            subtitle: result.data.subtitle || 'Stay updated with my latest work',
            articles: result.data.articles || []
          });
        }
      } catch (error) {
        console.error('Error loading news data:', error);
        setMessage('Error loading data. Using defaults.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewsData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArticleChange = (id, field, value) => {
    setNewsData(prev => ({
      ...prev,
      articles: prev.articles.map(article =>
        article.id === id ? { ...article, [field]: value } : article
      )
    }));
  };

  const handleImageSelect = (id, imageUrl) => {
    handleArticleChange(id, 'image', imageUrl);
  };

  const addArticle = () => {
    const newArticle = {
      id: Date.now(),
      title: 'New Article',
      content: 'Article content...',
      date: new Date().toISOString().split('T')[0],
      category: 'General',
      image: '',
      featured: false
    };
    setNewsData(prev => ({
      ...prev,
      articles: [...prev.articles, newArticle]
    }));
  };

  const removeArticle = (id) => {
    setNewsData(prev => ({
      ...prev,
      articles: prev.articles.filter(article => article.id !== id)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const result = await saveNewsData(newsData);
      if (result.success) {
        setMessage('News page data saved successfully!');
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving news data:', error);
      setMessage(`Error saving data: ${error.message}`);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleFetchRSS = async () => {
    setFetchingRSS(true);
    setMessage('Fetching latest news from RSS feeds...');
    try {
      const result = await fetchRSSNews();
      if (result.success) {
        setMessage(`Successfully fetched ${result.articlesCount || 0} new articles!`);
        // Reload data from database
        const dataResult = await getNewsData();
        if (dataResult.success && dataResult.data) {
          setNewsData({
            title: dataResult.data.title || newsData.title,
            subtitle: dataResult.data.subtitle || newsData.subtitle,
            articles: dataResult.data.articles || []
          });
        }
      } else {
        setMessage(`Error: ${result.error || 'Failed to fetch RSS news'}`);
      }
    } catch (error) {
      console.error('Error fetching RSS news:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setFetchingRSS(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <PasswordProtection pageName="News">
      <div className="make-news">
        <div className="editor-header">
          <h1>Edit News Page</h1>
          <div className="editor-actions">
            <button
              className="btn btn-primary"
              onClick={handleFetchRSS}
              disabled={fetchingRSS || loading}
            >
              <FaSync className={fetchingRSS ? 'spinning' : ''} />
              {fetchingRSS ? 'Fetching...' : 'Fetch RSS News'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleSave}
              disabled={saving || loading}
            >
              <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button className="btn btn-primary">
              <FaEye /> Preview
            </button>
          </div>
        </div>
        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
        {loading && <div className="loading">Loading data...</div>}

        <div className="editor-content">
          <div className="form-section">
            <h2>Page Information</h2>
            <div className="form-group">
              <label>Page Title</label>
              <input
                type="text"
                name="title"
                value={newsData.title}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={newsData.subtitle}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Articles</h2>
            {newsData.articles.map((article) => (
              <div key={article.id} className="article-item">
                <div className="article-header">
                  <h3>Article #{article.id}</h3>
                  <div className="article-controls">
                    <label className="featured-checkbox">
                      <input
                        type="checkbox"
                        checked={article.featured}
                        onChange={(e) => handleArticleChange(article.id, 'featured', e.target.checked)}
                      />
                      Featured
                    </label>
                    <button
                      onClick={() => removeArticle(article.id)}
                      className="remove-btn"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Article Title</label>
                    <input
                      type="text"
                      value={article.title}
                      onChange={(e) => handleArticleChange(article.id, 'title', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={article.category}
                      onChange={(e) => handleArticleChange(article.id, 'category', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={article.date}
                      onChange={(e) => handleArticleChange(article.id, 'date', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Content</label>
                  <textarea
                    value={article.content}
                    onChange={(e) => handleArticleChange(article.id, 'content', e.target.value)}
                    rows="4"
                    className="form-textarea"
                  />
                  {article.link && (
                    <small style={{ color: '#00CED1', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                      Source: <a href={article.link} target="_blank" rel="noopener noreferrer" style={{ color: '#00CED1' }}>
                        {article.link}
                      </a>
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <GitHubImagePicker
                    label={`Article Image - ${article.title}`}
                    currentImage={article.image}
                    onImageSelect={(imageUrl) => handleImageSelect(article.id, imageUrl)}
                  />
                </div>
              </div>
            ))}

            <button onClick={addArticle} className="add-article-btn">
              <FaPlus /> Add New Article
            </button>
          </div>
        </div>
      </div>
    </PasswordProtection>
  );
};

export default MakeNews;
