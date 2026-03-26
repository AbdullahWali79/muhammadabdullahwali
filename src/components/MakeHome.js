import React, { useState, useEffect } from 'react';
import PasswordProtection from './PasswordProtection';
import { saveHomeData, getHomeData } from '../services/supabaseService';
import { FaSave, FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './MakeHome.css';

const MakeHome = () => {
  const [homeData, setHomeData] = useState({
    title: 'Welcome to My Portfolio',
    subtitle: 'AI Automation & Custom Software Developer',
    description: 'Consistency Makes a Man Perfect in Their Skill Set. - M. Abdullah',
    buttonText: 'Get Started',
    buttonLink: '#contact',
    helloText: 'AsslamuAlikum',
    socialLinks: [
      { id: 1, platform: 'LinkedIn', icon: 'fab fa-linkedin', url: 'https://linkedin.com/in/muhammadabdullah', color: '#0077B5' },
      { id: 2, platform: 'Twitter', icon: 'fab fa-twitter', url: 'https://twitter.com/muhammadabdullah', color: '#1DA1F2' },
      { id: 3, platform: 'GitHub', icon: 'fab fa-github', url: 'https://github.com/AbdullahWali79', color: '#ffffff' },
      { id: 4, platform: 'YouTube', icon: 'fab fa-youtube', url: 'https://youtube.com/@muhammadabdullah', color: '#FF0000' }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Available social media platforms with icons
  const availablePlatforms = [
    { name: 'Website', icon: 'fas fa-globe', color: '#00CED1' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0077B5' },
    { name: 'Twitter', icon: 'fab fa-twitter', color: '#1DA1F2' },
    { name: 'Facebook', icon: 'fab fa-facebook', color: '#1877F2' },
    { name: 'Instagram', icon: 'fab fa-instagram', color: '#E4405F' },
    { name: 'GitHub', icon: 'fab fa-github', color: '#ffffff' },
    { name: 'YouTube', icon: 'fab fa-youtube', color: '#FF0000' },
    { name: 'Dribbble', icon: 'fab fa-dribbble', color: '#EA4C89' },
    { name: 'Behance', icon: 'fab fa-behance', color: '#1769FF' },
    { name: 'Medium', icon: 'fab fa-medium', color: '#00AB6C' },
    { name: 'Dev.to', icon: 'fab fa-dev', color: '#0A0A0A' },
    { name: 'Stack Overflow', icon: 'fab fa-stack-overflow', color: '#F58025' },
    { name: 'CodePen', icon: 'fab fa-codepen', color: '#000000' },
    { name: 'Discord', icon: 'fab fa-discord', color: '#5865F2' },
    { name: 'Slack', icon: 'fab fa-slack', color: '#4A154B' },
    { name: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25D366' },
    { name: 'Telegram', icon: 'fab fa-telegram', color: '#0088CC' },
    { name: 'TikTok', icon: 'fab fa-tiktok', color: '#000000' },
    { name: 'Pinterest', icon: 'fab fa-pinterest', color: '#E60023' },
    { name: 'Reddit', icon: 'fab fa-reddit', color: '#FF4500' },
    { name: 'Twitch', icon: 'fab fa-twitch', color: '#9146FF' }
  ];

  // Load data from database on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await getHomeData();
        
        // Load social links and helloText from localStorage
        const savedSocialLinks = localStorage.getItem('socialLinks');
        const savedHelloText = localStorage.getItem('helloText');
        
        const defaultSocialLinks = [
          { id: 1, platform: 'LinkedIn', icon: 'fab fa-linkedin', url: 'https://linkedin.com/in/muhammadabdullah', color: '#0077B5' },
          { id: 2, platform: 'Twitter', icon: 'fab fa-twitter', url: 'https://twitter.com/muhammadabdullah', color: '#1DA1F2' },
          { id: 3, platform: 'GitHub', icon: 'fab fa-github', url: 'https://github.com/AbdullahWali79', color: '#ffffff' },
          { id: 4, platform: 'YouTube', icon: 'fab fa-youtube', url: 'https://youtube.com/@muhammadabdullah', color: '#FF0000' }
        ];
        
        if (result.success && result.data) {
          setHomeData({
            title: result.data.title || 'Welcome to My Portfolio',
            subtitle: result.data.subtitle || 'AI Automation & Custom Software Developer',
            description: result.data.description || 'Consistency Makes a Man Perfect in Their Skill Set. - M. Abdullah',
            buttonText: result.data.button_text || 'Get Started',
            buttonLink: result.data.button_link || '#contact',
            helloText: savedHelloText || 'AsslamuAlikum',
            socialLinks: savedSocialLinks ? JSON.parse(savedSocialLinks) : defaultSocialLinks
          });
        } else {
          // Use defaults if no data in database
          setHomeData(prev => ({
            ...prev,
            helloText: savedHelloText || prev.helloText,
            socialLinks: savedSocialLinks ? JSON.parse(savedSocialLinks) : prev.socialLinks
          }));
        }
      } catch (error) {
        console.error('Error loading home data:', error);
        setMessage('Error loading data. Using defaults.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setHomeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialLinkChange = (id, field, value) => {
    setHomeData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(link =>
        link.id === id ? { ...link, [field]: value } : link
      )
    }));
  };

  const addSocialLink = () => {
    const newLink = {
      id: Date.now(),
      platform: 'LinkedIn',
      icon: 'fab fa-linkedin',
      url: '',
      color: '#0077B5'
    };
    setHomeData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newLink]
    }));
  };

  const removeSocialLink = (id) => {
    setHomeData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(link => link.id !== id)
    }));
  };

  const handlePlatformChange = (id, platformName) => {
    const platform = availablePlatforms.find(p => p.name === platformName);
    if (platform) {
      setHomeData(prev => ({
        ...prev,
        socialLinks: prev.socialLinks.map(link =>
          link.id === id ? { ...link, platform: platform.name, icon: platform.icon, color: platform.color } : link
        )
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      // Only save fields that exist in database (home_data table)
      const dataToSave = {
        title: homeData.title,
        subtitle: homeData.subtitle,
        description: homeData.description,
        button_text: homeData.buttonText,
        button_link: homeData.buttonLink
      };
      
      const result = await saveHomeData(dataToSave);
      
      if (result.success) {
        // Store social links and helloText in localStorage
        localStorage.setItem('socialLinks', JSON.stringify(homeData.socialLinks));
        localStorage.setItem('helloText', homeData.helloText);
        
        // Trigger a storage event to notify other components
        window.dispatchEvent(new Event('storage'));
        
        setMessage('Home page data saved successfully! Please refresh the home page to see changes.');
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving home data:', error);
      setMessage(`Error saving data: ${error.message}`);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const HomeEditor = () => (
    <div className="make-home">
      <div className="editor-header">
        <h1>Edit Home Page</h1>
        <div className="editor-actions">
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
          <h2>Hero Section</h2>
          <div className="form-group hello-text-group">
            <label>Hello Text (Orange Button)</label>
            <input
              type="text"
              name="helloText"
              value={homeData.helloText}
              onChange={handleInputChange}
              className="form-input hello-text-input"
              placeholder="Enter your custom hello text (e.g., HI, WELCOME, GREETINGS)"
            />
            <small className="form-help">This text appears in the orange button at the top of your home page</small>
          </div>
          
          <div className="form-group">
            <label>Main Title</label>
            <input
              type="text"
              name="title"
              value={homeData.title}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={homeData.subtitle}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={homeData.description}
              onChange={handleInputChange}
              rows="4"
              className="form-textarea"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Button Text</label>
              <input
                type="text"
                name="buttonText"
                value={homeData.buttonText}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Button Link</label>
              <input
                type="text"
                name="buttonLink"
                value={homeData.buttonLink}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Social Media Links</h2>
          <p className="section-description">Add your social media profile links that will appear on the home page</p>
          
          {homeData.socialLinks.map((link) => (
            <div key={link.id} className="social-link-item">
              <div className="social-link-header">
                <h3>
                  <i className={link.icon} style={{ color: link.color, marginRight: '10px' }}></i>
                  {link.platform}
                </h3>
                <button 
                  onClick={() => removeSocialLink(link.id)}
                  className="remove-btn"
                  type="button"
                >
                  <FaTrash />
                </button>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Platform</label>
                  <select
                    value={link.platform}
                    onChange={(e) => handlePlatformChange(link.id, e.target.value)}
                    className="form-input form-select"
                  >
                    {availablePlatforms.map(platform => (
                      <option key={platform.name} value={platform.name}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Profile URL</label>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleSocialLinkChange(link.id, 'url', e.target.value)}
                    className="form-input"
                    placeholder={`https://${link.platform.toLowerCase()}.com/your-profile`}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button onClick={addSocialLink} className="add-social-btn" type="button">
            <FaPlus /> Add Social Link
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <PasswordProtection pageName="Home">
      <HomeEditor />
    </PasswordProtection>
  );
};

export default MakeHome;
