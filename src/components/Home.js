import React, { useEffect, useState } from 'react';
import { FaDownload, FaEnvelope, FaPalette } from 'react-icons/fa';
import { generatePDF } from '../utils/pdfGenerator';
import { getPortfolioData, getAboutData } from '../services/supabaseService';
import { THEME_PRESETS, applyThemeSettings, getSiteSettings } from '../utils/siteSettings';
import './Home.css';

const AYAH_ROTATION_MS = 5000;
const AYAH_REFERENCES = [
  '97:1','94:6','93:5','65:3','2:286','2:255','3:8','3:26','3:173',
  '4:59','4:135','4:147','5:8','5:35','5:54','6:17','6:59','6:103',
  '7:23','7:56','7:180','7:199','7:205','8:2','9:40','9:51','9:111',
  '10:62','10:107','11:90','11:114','12:87','13:11','13:28','14:7',
  '14:34','15:49','16:53','16:97','17:23','17:36','17:80','17:84',
  '18:10','18:46','18:65','20:46','21:35','22:5','22:46','23:96',
  '24:35','24:37','25:63','25:70','28:77','29:2','29:69','30:21',
  '31:33','32:7','33:17','33:41','34:39','35:3','36:82','37:180',
  '38:35','39:10','39:53','40:60','41:30','41:34','42:40','43:14',
  '46:13','47:7','49:10','49:13','50:16','51:17','51:58','55:13',
  '55:60','57:1','57:4','58:11','59:18','60:7','61:13','64:14',
  '65:2','66:6','67:2','68:4','70:19','73:8','76:8','84:6','86:17',
  '93:7','94:5','95:6','103:3','105:1','107:7','109:6','112:1','113:1'
];
const AYAH_EDITIONS = 'quran-uthmani,ur.jalandhry';

const MAX_URDU_LINE_CHARS = 48;

const FALLBACK_AYAHS = [
  { arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', urdu: 'بے شک تنگی کے ساتھ آسانی ہے۔', reference: 'الشرح ۵' },
  { arabic: 'وَرَبَّكَ فَكَبِّرْ', urdu: 'اور اپنے رب کی بڑائی بیان کرو۔', reference: 'المدثر ۳' },
  { arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', urdu: 'کہہ دیجیے کہ وہ اللہ ایک ہے۔', reference: 'الاخلاص ۱' },
  { arabic: 'وَقُولُوا لِلنَّاسِ حُسْنًا', urdu: 'اور لوگوں سے اچھی بات کہو۔', reference: 'البقرہ ۸۳' },
  { arabic: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ', urdu: 'اور نماز قائم کرو اور زکوٰۃ دو۔', reference: 'البقرہ ۱۱۰' },
  { arabic: 'إِنَّ اللَّهَ عَلِيمٌ خَبِيرٌ', urdu: 'بے شک اللہ خوب جاننے والا اور خبردار ہے۔', reference: 'الانفال ۴۲' },
  { arabic: 'وَاللَّهُ يَعْلَمُ وَأَنْتُمْ لَا تَعْلَمُونَ', urdu: 'اور اللہ جانتا ہے اور تم نہیں جانتے۔', reference: 'البقرہ ۲۱۶' },
  { arabic: 'وَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ', urdu: 'اور جس نے ذرّہ برابر بھی نیکی کی وہ اسے دیکھ لے گا۔', reference: 'الزلزال ۷' },
  { arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', urdu: 'اللہ کسی جان پر اس کی وسعت سے زیادہ ذمہ داری نہیں دیتا۔', reference: 'البقرہ ۲۸۶' },
  { arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', urdu: 'بے شک اللہ صبر کرنے والوں کے ساتھ ہے۔', reference: 'البقرہ ۱۵۳' },
  { arabic: 'وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ', urdu: 'اور میری توفیق صرف اللہ کی ذات سے ہے۔', reference: 'هود ۸۸' },
  { arabic: 'وَلَقَدْ كَرَّمْنَا بَنِي آدَمَ', urdu: 'اور بے شک ہم نے بنی آدم کو باعزت بنایا۔', reference: 'الاسراء ۷۰' },
  { arabic: 'إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنْكَرِ', urdu: 'بے شک نماز بے حیائی اور برائی سے روکتی ہے۔', reference: 'العنکبوت ۴۵' },
  { arabic: 'يُضِلُّ بِهِ كَثِيرًا وَيَهْدِي بِهِ كَثِيرًا', urdu: 'اس سے بہتوں کو گمراہ کرتا ہے اور بہتوں کو ہدایت دیتا ہے۔', reference: 'البقرہ ۲۶' },
  { arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا إِنَّ مَعَ الْعُسْرِ يُسْرًا', urdu: 'پس بے شک تنگی کے ساتھ آسانی ہے۔', reference: 'الشرح ۵-۶' },
  { arabic: 'وَإِنْ تَعُدُّوا نِعْمَتَ اللَّهِ لَا تُحْصُوهَا', urdu: 'اور اگر تم اللہ کی نعمتوں کا شمار کرو تو اسے گن نہیں سکتے۔', reference: 'النحل ۱۸' },
  { arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', urdu: 'اللہ کے ذکر سے دلوں کو اطمینان حاصل ہوتا ہے۔', reference: 'الرعد ۲۸' },
  { arabic: 'وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', urdu: 'اور جو اللہ پر توکل کرے تو وہ اس کے لیے کافی ہے۔', reference: 'الطلاق ۳' },
  { arabic: 'وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا', urdu: 'اور جو اللہ کا تقویٰ اختیار کرے اللہ اس کے لیے راستہ بناتا ہے۔', reference: 'الطلاق ۲' },
  { arabic: 'وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ', urdu: 'اور اسے وہاں سے رزق دیتا ہے جہاں سے اسے گمان بھی نہیں ہوتا۔', reference: 'الطلاق ۳' },
  { arabic: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ', urdu: 'بے شک ہم اللہ ہی کے ہیں اور اللہ ہی کی طرف لوٹنے والے ہیں۔', reference: 'البقرہ ۱۵۶' },
  { arabic: 'رَبِّ زِدْنِي عِلْمًا', urdu: 'اے میرے رب! میرے علم میں اضافہ فرما۔', reference: 'طہ ۱۱۴' },
  { arabic: 'وَجَعَلْنَا لَكُمْ فِيهَا مَعَايِشَ', urdu: 'اور ہم نے ان میں تمہارے لیے روزی کے سامان بنائے۔', reference: 'الحجر ۲۰' },
  { arabic: 'وَاللَّهُ خَيْرُ الرَّازِقِينَ', urdu: 'اور اللہ سب سے بہتر رزق دینے والا ہے۔', reference: 'الجمعة ۱۱' },
  { arabic: 'وَأَحْسِنُوا ۛ إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ', urdu: 'اور نیکی کرو، بے شک اللہ نیکی کرنے والوں سے محبت فرماتا ہے۔', reference: 'البقرہ ۱۹۵' },
  { arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', urdu: 'کہہ دیجیے کہ میں صبح کے رب کی پناہ مانگتا ہوں۔', reference: 'الفلق ۱' },
  { arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', urdu: 'کہہ دیجیے کہ میں لوگوں کے رب کی پناہ مانگتا ہوں۔', reference: 'الناس ۱' },
  { arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي', urdu: 'اے میرے رب! میرے لیے میرا سینہ کشادہ فرما۔', reference: 'طہ ۲۵' },
  { arabic: 'وَيَسِّرْ لِي أَمْرِي', urdu: 'اور میرے لیے میرا کام آسان بنا دے۔', reference: 'طہ ۲۶' },
  { arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً', urdu: 'اے ہمارے رب! ہمیں دنیا میں بھی نیکی دے اور آخرت میں بھی نیکی دے۔', reference: 'البقرہ ۲۰۱' }
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

            if (urdu.length > MAX_URDU_LINE_CHARS) {
              throw new Error(`Ayah too long for one line: ${reference}`);
            }

            return { arabic, urdu, reference };
          })
        );

        const loadedAyahs = responses
          .filter((result) => result.status === 'fulfilled')
          .map((result) => result.value)
          .filter((ayah) => ayah.urdu.length <= MAX_URDU_LINE_CHARS);

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
                <div className="ayah-card-badges">
                  <span className="ayah-badge-primary">قرآنی آیت</span>
                  {!isAyahLoading && dailyAyah.reference && (
                    <span className="ayah-badge-secondary">{dailyAyah.reference}</span>
                  )}
                </div>
                <p className="ayah-one-line" dir="rtl" lang="ur">
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
