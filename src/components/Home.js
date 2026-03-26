import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDownload, FaEnvelope } from 'react-icons/fa';
import { generatePDF } from '../utils/pdfGenerator';
import { getPortfolioData, getAboutData } from '../services/supabaseService';
import './Home.css';

const Home = ({ userData }) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [localUserData, setLocalUserData] = useState(userData);

  const handleDownloadCV = async () => {
    setIsGenerating(true);
    try {
      // Fetch portfolio and skills data
      const [portfolioResult, aboutResult] = await Promise.all([
        getPortfolioData(),
        getAboutData()
      ]);

      const portfolioData = portfolioResult.success ? portfolioResult.data : null;
      const aboutData = aboutResult.success ? aboutResult.data : null;

      // Generate PDF with all data
      await generatePDF(userData, portfolioData, aboutData);
    } catch (error) {
      console.error('Error fetching data for PDF:', error);
      alert('Error loading data. Generating PDF with available information...');
      await generatePDF(userData, null, null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContactMe = () => {
    // Redirect to WhatsApp
    const whatsappNumber = '923046983794';
    const whatsappUrl = `https://wa.me/${whatsappNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  // Load social links from localStorage on mount and when storage changes
  useEffect(() => {
    const loadLocalData = () => {
      const savedSocialLinks = localStorage.getItem('socialLinks');
      const savedHelloText = localStorage.getItem('helloText');
      
      if (savedSocialLinks || savedHelloText) {
        setLocalUserData(prev => ({
          ...prev,
          socialLinks: savedSocialLinks ? JSON.parse(savedSocialLinks) : prev.socialLinks,
          helloText: savedHelloText || prev.helloText
        }));
      }
    };

    // Load on mount
    loadLocalData();

    // Listen for storage changes
    window.addEventListener('storage', loadLocalData);
    
    return () => {
      window.removeEventListener('storage', loadLocalData);
    };
  }, []);

  // Update localUserData when userData prop changes
  useEffect(() => {
    setLocalUserData(userData);
  }, [userData]);

  // Typing animation effect with loop
  useEffect(() => {
    const fullText = localUserData.summary?.replace(/ - /g, ' \u2013 ') || '';
    if (!fullText) return;

    let currentIndex = 0;
    let typingInterval = null;
    let pauseTimeout = null;

    const startTyping = () => {
      setDisplayedText('');
      setIsTyping(true);
      currentIndex = 0;

      typingInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
          
          // Wait 2 seconds before restarting
          pauseTimeout = setTimeout(() => {
            startTyping();
          }, 2000);
        }
      }, 50); // Adjust speed here (lower = faster)
    };

    startTyping();

    return () => {
      if (typingInterval) clearInterval(typingInterval);
      if (pauseTimeout) clearTimeout(pauseTimeout);
    };
  }, [localUserData.summary]);


  return (
    <div className="home">
      <div className="home-container">
        <div className="hero-section">
          <div className="hello-badge">{localUserData.helloText || 'AsslamuAlikum'}</div>
          <div className="hero-content">
            <div className="hero-image">
              {localUserData.profileImage ? (
                <img src={localUserData.profileImage} alt="Profile" />
              ) : (
                <div className="default-hero-avatar">
                  {localUserData.firstName.charAt(0)}{localUserData.lastName.charAt(0)}
                </div>
              )}
            </div>
            <div className="hero-text">
              <h1 className="hero-title">{localUserData.firstName} {localUserData.lastName}</h1>
              <p className="hero-summary">
                {displayedText}
                {isTyping && <span className="typing-cursor">|</span>}
              </p>
            </div>
          </div>
        </div>

        <div className="personal-info">
          <div className="info-tables-container">
            <table className="info-table">
              <tbody>
                <tr className="info-row">
                  <td className="info-cell">
                    <div className="info-icon">👤</div>
                    <span className="info-label">Full Name:</span>
                  </td>
                  <td className="info-cell">
                    <span className="info-value">{localUserData.firstName} {localUserData.lastName}</span>
                  </td>
                </tr>
                <tr className="info-row">
                  <td className="info-cell">
                    <div className="info-icon">📅</div>
                    <span className="info-label">Date of Birth:</span>
                  </td>
                  <td className="info-cell">
                    <span className="info-value">{localUserData.dateOfBirth}</span>
                  </td>
                </tr>
                <tr className="info-row">
                  <td className="info-cell">
                    <div className="info-icon">📞</div>
                    <span className="info-label">Phone:</span>
                  </td>
                  <td className="info-cell">
                    <span className="info-value">{localUserData.phone}</span>
                  </td>
                </tr>
                <tr className="info-row">
                  <td className="info-cell">
                    <div className="info-icon">📍</div>
                    <span className="info-label">Address:</span>
                  </td>
                  <td className="info-cell">
                    <span className="info-value">{localUserData.address}</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="info-table">
              <tbody>
                <tr className="info-row">
                  <td className="info-cell">
                    <div className="info-icon">✉️</div>
                    <span className="info-label">Email Address:</span>
                  </td>
                  <td className="info-cell">
                    <span className="info-value">{localUserData.email}</span>
                  </td>
                </tr>
                <tr className="info-row">
                  <td className="info-cell">
                    <div className="info-icon">💼</div>
                    <span className="info-label">Professional Title:</span>
                  </td>
                  <td className="info-cell">
                    <span className="info-value">{localUserData.title}</span>
                  </td>
                </tr>
                <tr className="info-row">
                  <td className="info-cell">
                    <div className="info-icon">🌐</div>
                    <span className="info-label">Languages:</span>
                  </td>
                  <td className="info-cell">
                    <span className="info-value">{localUserData.languages}</span>
                  </td>
                </tr>
                <tr className="info-row">
                  <td className="info-cell">
                    <div className="info-icon">🏳️</div>
                    <span className="info-label">Nationality:</span>
                  </td>
                  <td className="info-cell">
                    <span className="info-value">{localUserData.nationality}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={handleDownloadCV} disabled={isGenerating}>
            <FaDownload className="btn-icon" />
            {isGenerating ? 'Generating PDF...' : 'Download Resume'}
          </button>
          <button className="btn btn-primary" onClick={handleContactMe}>
            <FaEnvelope className="btn-icon" />
            Contact Me
          </button>
        </div>

        {/* Social Media Links Section */}
        {localUserData.socialLinks && localUserData.socialLinks.length > 0 && (
          <div className="social-links-section">
            <h3>Follow Me</h3>
            <div className="social-grid">
              {localUserData.socialLinks.map((link) => (
                link.url && (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-link"
                  >
                    <i className={link.icon} style={{ color: link.color }}></i>
                    {link.platform}
                  </a>
                )
              ))}
            </div>
          </div>
        )}
      </div>
      
      <footer className="footer">
        <p>© 2026 {localUserData.firstName} {localUserData.lastName}. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;

