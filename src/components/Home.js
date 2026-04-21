import React, { useEffect, useState } from 'react';
import { FaDownload, FaEnvelope, FaPalette } from 'react-icons/fa';
import { generatePDF } from '../utils/pdfGenerator';
import { getPortfolioData, getAboutData } from '../services/supabaseService';
import { THEME_PRESETS, applyThemeSettings, getSiteSettings } from '../utils/siteSettings';
import './Home.css';

const AYAH_ROTATION_MS = 5000;
const AYAH_REFERENCES = ['97:1', '94:6', '93:5', '65:3'];
const AYAH_EDITIONS = 'quran-uthmani,ur.jalandhry';

const FALLBACK_AYAHS = [
  {
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    urdu: 'بے شک تنگی کے ساتھ آسانی ہے۔'
  },
  {
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
    urdu: 'پس تم مجھے یاد کرو، میں تمہیں یاد کروں گا۔'
  },
  {
    arabic: 'وَرَبَّكَ فَكَبِّرْ',
    urdu: 'اور اپنے رب کی بڑائی بیان کرو۔'
  }
];

const getAyahApiUrl = (reference) =>
  `https://api.alquran.cloud/v1/ayah/${reference}/editions/${AYAH_EDITIONS}`;

const trimArabicLetters = (text = '', maxLetters = 200) => {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return '';
  }

  let result = '';
  let letters = 0;

  for (const char of normalized) {
    if (/\s/u.test(char)) {
      result += char;
      continue;
    }
    if (letters >= maxLetters) {
      break;
    }
    result += char;
    letters += 1;
  }

  return result.trim();
};

const Home = ({ userData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [localUserData, setLocalUserData] = useState(userData);
  const [temporaryThemeKey, setTemporaryThemeKey] = useState('');
  const [baseThemeSettings] = useState(() => getSiteSettings());
  const [ayahItems, setAyahItems] = useState(FALLBACK_AYAHS);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [isAyahLoading, setIsAyahLoading] = useState(true);

  const dailyAyah = ayahItems[currentAyahIndex] || FALLBACK_AYAHS[0];

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
    window.open('https://wa.me/923046983794', '_blank');
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

    const loadAyahs = async () => {
      setIsAyahLoading(true);
      try {
        const responses = await Promise.allSettled(
          AYAH_REFERENCES.map(async (reference) => {
            const response = await fetch(getAyahApiUrl(reference), {
              headers: {
                Accept: 'application/json'
              }
            });

            if (!response.ok) {
              throw new Error(`Quran API failed for ${reference}`);
            }

            const payload = await response.json();
            const editions = Array.isArray(payload?.data) ? payload.data : [];
            const arabicEdition = editions.find((item) => item?.edition?.language === 'ar');
            const urduEdition = editions.find((item) => item?.edition?.language === 'ur');

            const arabic = trimArabicLetters(arabicEdition?.text?.trim() || '');
            const urdu = urduEdition?.text?.trim() || '';

            if (!arabic || !urdu) {
              throw new Error(`Invalid ayah payload for ${reference}`);
            }

            return { arabic, urdu };
          })
        );

        const loadedAyahs = responses
          .filter((result) => result.status === 'fulfilled')
          .map((result) => result.value);

        if (mounted) {
          setAyahItems(loadedAyahs.length > 0 ? loadedAyahs : FALLBACK_AYAHS);
          setCurrentAyahIndex(0);
        }
      } catch (error) {
        console.error('Error loading Quran ayahs:', error);
        if (mounted) {
          setAyahItems(FALLBACK_AYAHS);
          setCurrentAyahIndex(0);
        }
      } finally {
        if (mounted) {
          setIsAyahLoading(false);
        }
      }
    };

    loadAyahs();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (ayahItems.length < 2) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCurrentAyahIndex((prev) => (prev + 1) % ayahItems.length);
    }, AYAH_ROTATION_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [ayahItems]);

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
    return () => window.removeEventListener('storage', loadLocalData);
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
        pauseTimeout = setTimeout(() => startTyping(), 2000);
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
                <div className="ayah-card-header">
                  <span className="ayah-label">Quran Reflection</span>
                </div>
                <div className="ayah-content-wrap">
                  <p className="ayah-one-line" dir="rtl" lang="ar">
                    {isAyahLoading ? '...' : dailyAyah.arabic}
                  </p>
                  <p className="ayah-one-line ayah-urdu-line" dir="rtl" lang="ur">
                    {isAyahLoading ? '...' : dailyAyah.urdu}
                  </p>
                </div>
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
