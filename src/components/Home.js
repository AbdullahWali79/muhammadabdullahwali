import React, { useState, useEffect } from 'react';
import { FaDownload, FaEnvelope, FaPalette } from 'react-icons/fa';
import { generatePDF } from '../utils/pdfGenerator';
import { getPortfolioData, getAboutData } from '../services/supabaseService';
import { THEME_PRESETS, applyThemeSettings, getSiteSettings } from '../utils/siteSettings';
import './Home.css';

const QURAN_AYAH_API =
  'https://api.alquran.cloud/v1/ayah/97:1/editions/quran-uthmani,ur.jalandhry';

const FALLBACK_AYAH_TEXT = {
  arabic: 'إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ',
  urdu: 'بے شک ہم نے اسے شبِ قدر میں نازل کیا۔'
};

const Home = ({ userData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [localUserData, setLocalUserData] = useState(userData);
  const [temporaryThemeKey, setTemporaryThemeKey] = useState('');
  const [baseThemeSettings] = useState(() => getSiteSettings());
  const [dailyAyah, setDailyAyah] = useState(FALLBACK_AYAH_TEXT);
  const [isAyahLoading, setIsAyahLoading] = useState(true);

  const handleDownloadCV = async () => {
    setIsGenerating(true);
    try {
      const [portfolioResult, aboutResult] = await Promise.all([getPortfolioData(), getAboutData()]);

      const portfolioData = portfolioResult.success ? portfolioResult.data : null;
      const aboutData = aboutResult.success ? aboutResult.data : null;

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
    const whatsappNumber = '923046983794';
    const whatsappUrl = `https://wa.me/${whatsappNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleTemporaryThemeApply = (presetKey) => {
    const preset = THEME_PRESETS[presetKey];
    if (!preset) {
      return;
    }

    const temporarySettings = {
      ...baseThemeSettings,
      theme: {
        ...baseThemeSettings.theme,
        ...preset.theme
      },
      sidebar: {
        ...baseThemeSettings.sidebar,
        ...preset.sidebar
      }
    };

    applyThemeSettings(temporarySettings);
    setTemporaryThemeKey(presetKey);
  };

  const handleTemporaryThemeReset = () => {
    applyThemeSettings(baseThemeSettings);
    setTemporaryThemeKey('');
  };

  const handleTemporaryThemeSelectChange = (event) => {
    const selectedPresetKey = event.target.value;
    if (!selectedPresetKey) {
      handleTemporaryThemeReset();
      return;
    }
    handleTemporaryThemeApply(selectedPresetKey);
  };

  useEffect(() => {
    let mounted = true;

    const loadAyah = async () => {
      setIsAyahLoading(true);

      try {
        const response = await fetch(QURAN_AYAH_API, {
          headers: {
            Accept: 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Quran API request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const editions = Array.isArray(payload?.data) ? payload.data : [];
        const arabicEdition = editions.find((item) => item?.edition?.language === 'ar');
        const urduEdition = editions.find((item) => item?.edition?.language === 'ur');

        const arabic = arabicEdition?.text?.trim() || '';
        const shortArabic = arabic.split(/\s+/).filter(Boolean).slice(0, 30).join(' ').trim();
        const urdu = urduEdition?.text?.trim() || '';

        if (!shortArabic || !urdu) {
          throw new Error('Arabic or Urdu text missing in Quran API response');
        }

        if (mounted) {
          setDailyAyah({
            arabic: shortArabic,
            urdu
          });
        }
      } catch (error) {
        console.error('Error loading Quran ayah:', error);
        if (mounted) {
          setDailyAyah(FALLBACK_AYAH_TEXT);
        }
      } finally {
        if (mounted) {
          setIsAyahLoading(false);
        }
      }
    };

    loadAyah();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const loadLocalData = () => {
      const savedSocialLinks = localStorage.getItem('socialLinks');
      const savedHelloText = localStorage.getItem('helloText');

      if (savedSocialLinks || savedHelloText) {
        setLocalUserData((prev) => ({
          ...prev,
          socialLinks: savedSocialLinks ? JSON.parse(savedSocialLinks) : prev.socialLinks,
          helloText: savedHelloText || prev.helloText
        }));
      }
    };

    loadLocalData();
    window.addEventListener('storage', loadLocalData);

    return () => {
      window.removeEventListener('storage', loadLocalData);
    };
  }, []);

  useEffect(() => {
    setLocalUserData(userData);
  }, [userData]);

  useEffect(() => {
    const fullText = localUserData.summary?.replace(/ - /g, ' - ') || '';
    if (!fullText) {
      return undefined;
    }

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
          currentIndex += 1;
          return;
        }

        setIsTyping(false);
        clearInterval(typingInterval);

        pauseTimeout = setTimeout(() => {
          startTyping();
        }, 2000);
      }, 50);
    };

    startTyping();

    return () => {
      if (typingInterval) {
        clearInterval(typingInterval);
      }
      if (pauseTimeout) {
        clearTimeout(pauseTimeout);
      }
    };
  }, [localUserData.summary]);

  return (
    <div className="home">
      <div className="home-container">
        <div className="hero-section">
          <div className="theme-preview-switcher">
            <div className="theme-preview-row">
              <div className="theme-preview-control">
                <div className="theme-preview-header">
                  <FaPalette />
                  <span>Try Theme (Temporary)</span>
                </div>
                <select
                  className="theme-preview-select"
                  value={temporaryThemeKey}
                  onChange={handleTemporaryThemeSelectChange}
                  aria-label="Theme preview selector"
                >
                  <option value="">Default (Saved)</option>
                  {Object.entries(THEME_PRESETS).map(([presetKey, preset]) => (
                    <option key={presetKey} value={presetKey}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ayah-preview-card">
                <span className="ayah-label">Quran Reflection</span>
                <p className="ayah-one-line" dir="rtl" lang="ar">
                  {isAyahLoading ? '...' : dailyAyah.arabic}
                </p>
                <p className="ayah-one-line ayah-urdu-line" dir="rtl" lang="ur">
                  {isAyahLoading ? '...' : dailyAyah.urdu}
                </p>
              </div>
            </div>
          </div>

          <div className="hello-badge">{localUserData.helloText || 'AsslamuAlikum'}</div>
          <div className="hero-content">
            <div className="hero-image">
              {localUserData.profileImage ? (
                <img src={localUserData.profileImage} alt="Profile" />
              ) : (
                <div className="default-hero-avatar">
                  {localUserData.firstName.charAt(0)}
                  {localUserData.lastName.charAt(0)}
                </div>
              )}
            </div>
            <div className="hero-text">
              <h1 className="hero-title">
                {localUserData.firstName} {localUserData.lastName}
              </h1>
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
                    <span className="info-value">
                      {localUserData.firstName} {localUserData.lastName}
                    </span>
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

        {localUserData.socialLinks && localUserData.socialLinks.length > 0 && (
          <div className="social-links-section">
            <h3>Follow Me</h3>
            <div className="social-grid">
              {localUserData.socialLinks.map(
                (link) =>
                  link.url && (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      <i className={link.icon} style={{ color: link.color }} />
                      {link.platform}
                    </a>
                  )
              )}
            </div>
          </div>
        )}
      </div>

      <footer className="footer">
        <p>
          © 2026 {localUserData.firstName} {localUserData.lastName}. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
