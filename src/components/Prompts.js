import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlayCircle } from 'react-icons/fa';
import { getPromptsData } from '../services/supabaseService';
import './Prompts.css';

// Helper to extract YouTube video ID to fetch thumbnail
const getYouTubeThumbnail = (url) => {
  if (!url) return null;
  
  let videoId = '';
  // Match standard and short URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    videoId = match[2];
  } else {
    // If we can't parse it, return null
    return null;
  }

  // Return the high-quality YouTube thumbnail
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

const Prompts = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [promptsData, setPromptsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleViewDetails = (promptId, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/prompts/${promptId}`);
  };

  useEffect(() => {
    const loadPromptsData = async () => {
      try {
        const result = await getPromptsData();
        if (result.success && result.data) {
          setPromptsData(result.data);
        }
      } catch (error) {
        console.error('Error loading prompts data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPromptsData();
  }, []);

  if (loading) {
    return (
      <div className="prompts-page">
        <div className="prompts-container">
          <div className="loading" style={{ color: 'var(--site-accent-color)', textAlign: 'center', marginTop: '50px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  const displayTitle = promptsData?.title || 'System Prompts';
  const displaySubtitle = promptsData?.subtitle || 'A collection of my best AI system prompts and workflows';
  const prompts = promptsData?.prompts || [];

  // Extract unique categories from prompts
  const allCategories = ['All', ...new Set(prompts.map(p => p.category).filter(Boolean))];
  const categories = allCategories.length > 1 ? allCategories : ['All'];

  // Filter prompts based on active filter
  const filteredPrompts = activeFilter === 'All' 
    ? prompts 
    : prompts.filter(prompt => prompt.category === activeFilter);

  const handleFilterClick = (category) => {
    setActiveFilter(category);
  };

  return (
    <div className="prompts-page">
      <div className="prompts-container">
        <div className="prompts-header">
          <h1>{displayTitle}</h1>
          <p>{displaySubtitle}</p>
        </div>
        
        {prompts.length > 0 ? (
          <>
            <div className="prompts-filters">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                  onClick={() => handleFilterClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="prompts-grid">
              {filteredPrompts.map((prompt) => {
                const thumbnailUrl = getYouTubeThumbnail(prompt.youtubeUrl);
                return (
                  <div key={prompt.id} className="prompt-card" onClick={(e) => handleViewDetails(prompt.id, e)}>
                    <div className="prompt-image">
                      {thumbnailUrl ? (
                        <img 
                          src={thumbnailUrl} 
                          alt={prompt.title}
                          className="prompt-img"
                        />
                      ) : (
                        <div className="prompt-default-bg">
                          <h3>Muhammad Abdullah</h3>
                          <p>Prompt Engineer</p>
                        </div>
                      )}
                      <div className="prompt-overlay">
                        <div className="action-btn">
                          <FaPlayCircle style={{ fontSize: '28px' }} />
                        </div>
                      </div>
                    </div>
                    <div className="prompt-content">
                      <div className="prompt-category">{prompt.category}</div>
                      <h3 className="prompt-title">{prompt.title}</h3>
                      <p className="prompt-description">{prompt.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--site-sidebar-muted-text-color)', marginTop: '50px' }}>
            <p>No prompts available yet. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prompts;

