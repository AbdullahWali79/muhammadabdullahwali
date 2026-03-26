import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { getUserData } from './services/supabaseService';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import About from './components/About';
import Service from './components/Service';
import Portfolio from './components/Portfolio';
import PortfolioDetail from './components/PortfolioDetail';
import News from './components/News';
import NewsDetail from './components/NewsDetail';
import Contact from './components/Contact';
import CVForm from './components/CVForm';
import Prompts from './components/Prompts';
import PromptDetail from './components/PromptDetail';
import MakePrompts from './components/MakePrompts';
import DigitalProducts from './components/DigitalProducts';
import MakeDigitalProducts from './components/MakeDigitalProducts';
import MakeHome from './components/MakeHome';
import MakeAbout from './components/MakeAbout';
import MakeService from './components/MakeService';
import MakePortfolio from './components/MakePortfolio';
import MakeNews from './components/MakeNews';
import MakeContact from './components/MakeContact';
import MakeFreelancingTasks from './components/MakeFreelancingTasks';
import MakeSettings from './components/MakeSettings';
import SecurityManager from './components/SecurityManager';
import FreelancingTasks from './components/FreelancingTasks';
import './components/Mobile.css';
import './components/MobileTable.css';
import PasswordProtection from './components/PasswordProtection';
import { applyThemeSettings, getSiteSettings } from './utils/siteSettings';
import './App.css';

function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [settingsVersion, setSettingsVersion] = useState(0);
  const [userData, setUserData] = useState({
    firstName: 'Muhammad',
    lastName: 'Abdullah',
    title: 'AI Automation & Custom Software Developer',
    dateOfBirth: '25-12-1990',
    nationality: 'Pakistan',
    phone: '+923046983794',
    email: 'abdullahwale@gmail.com',
    address: 'Pakistan',
    languages: 'English, Urdu, Punjabi',
    profileImage: 'https://raw.githubusercontent.com/AbdullahWali79/AbdullahImages/main/Professional.jpeg',
    summary: 'Consistency Makes a Man Perfect in Their Skill Set. - M. Abdullah',
    helloText: 'AsslamuAlikum',
    socialLinks: [
      { id: 1, platform: 'LinkedIn', icon: 'fab fa-linkedin', url: 'https://linkedin.com/in/muhammadabdullah', color: '#0077B5' },
      { id: 2, platform: 'Twitter', icon: 'fab fa-twitter', url: 'https://twitter.com/muhammadabdullah', color: '#1DA1F2' },
      { id: 3, platform: 'GitHub', icon: 'fab fa-github', url: 'https://github.com/AbdullahWali79', color: '#ffffff' },
      { id: 4, platform: 'YouTube', icon: 'fab fa-youtube', url: 'https://youtube.com/@muhammadabdullah', color: '#FF0000' }
    ]
  });

  // Load user data from database on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const result = await getUserData();
        
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
          // Convert database format to component format
          const dbData = result.data;
          setUserData({
            firstName: dbData.first_name || 'Muhammad',
            lastName: dbData.last_name || 'Abdullah',
            title: dbData.title || 'AI Automation & Custom Software Developer',
            dateOfBirth: dbData.date_of_birth || '25-12-1990',
            nationality: dbData.nationality || 'Pakistan',
            phone: dbData.phone || '+923046983794',
            email: dbData.email || 'abdullahwale@gmail.com',
            address: dbData.address || 'Pakistan',
            languages: dbData.languages || 'English, Urdu, Punjabi',
            profileImage: dbData.profile_image || 'https://raw.githubusercontent.com/AbdullahWali79/AbdullahImages/main/Professional.jpeg',
            summary: dbData.summary || 'Consistency Makes a Man Perfect in Their Skill Set. - M. Abdullah',
            helloText: savedHelloText || 'AsslamuAlikum',
            socialLinks: savedSocialLinks ? JSON.parse(savedSocialLinks) : defaultSocialLinks
          });
        } else {
          // Use localStorage data if available
          setUserData(prev => ({
            ...prev,
            helloText: savedHelloText || prev.helloText,
            socialLinks: savedSocialLinks ? JSON.parse(savedSocialLinks) : prev.socialLinks
          }));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Keep default data if database fails
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    applyThemeSettings(getSiteSettings());

    const handleSettingsUpdated = () => {
      applyThemeSettings(getSiteSettings());
      setSettingsVersion((prev) => prev + 1);
    };

    window.addEventListener('site-settings-updated', handleSettingsUpdated);
    return () => {
      window.removeEventListener('site-settings-updated', handleSettingsUpdated);
    };
  }, []);

  const location = useLocation();
  const currentSettings = useMemo(() => getSiteSettings(), [settingsVersion]);
  const backgroundModeClass = `app-bg-${currentSettings.theme.backgroundMode || 'solid'}`;
  const backgroundMotionClass = currentSettings.theme.motionEnabled ? 'app-bg-motion' : 'app-bg-static';
  const getActiveSection = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'home';
      case '/about':
        return 'about';
      case '/service':
        return 'service';
      case '/portfolio':
        return 'portfolio';
      case '/portfolio/:id':
        return 'portfolio';
      case '/news':
        return 'news';
      case '/news/:id':
        return 'news';
      case '/contact':
        return 'contact';
      case '/makecv':
        return 'make-cv';
      case '/prompts':
      case '/prompts/:id':
        return 'prompts';
      case '/makeprompts':
        return 'make-prompts';
      case '/digital-products':
        return 'digital-products';
      case '/makedigitalproducts':
      case '/makedigital-products':
        return 'make-digital-products';
      case '/makehome':
        return 'make-home';
      case '/makeabout':
        return 'make-about';
      case '/makeservice':
        return 'make-service';
      case '/makeportfolio':
        return 'make-portfolio';
      case '/makenews':
        return 'make-news';
      case '/makecontact':
        return 'make-contact';
      case '/security':
        return 'security';
      case '/makesettings':
      case '/make-settings':
      case '/settings':
        return 'make-settings';
      default:
        return 'home';
    }
  };

  return (
    <div className={`app ${backgroundModeClass} ${backgroundMotionClass}`}>
      <Sidebar 
        activeSection={getActiveSection()} 
        userData={userData}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="route-shell">
          <Routes>
            <Route path="/" element={<Home userData={userData} />} />
            <Route path="/about" element={<About userData={userData} />} />
            <Route path="/service" element={<Service />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:id" element={<PortfolioDetail />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/contact" element={<Contact userData={userData} />} />
            <Route path="/prompts" element={<Prompts />} />
            <Route path="/prompts/:id" element={<PromptDetail />} />
            <Route path="/digital-products" element={<DigitalProducts userData={userData} />} />
            <Route path="/makecv" element={
              <PasswordProtection pageName="CV Creation">
                <CVForm userData={userData} setUserData={setUserData} />
              </PasswordProtection>
            } />
            <Route path="/makehome" element={
              <PasswordProtection pageName="Home Editor">
                <MakeHome />
              </PasswordProtection>
            } />
            <Route path="/makeabout" element={
              <PasswordProtection pageName="About Editor">
                <MakeAbout />
              </PasswordProtection>
            } />
            <Route path="/makeservice" element={
              <PasswordProtection pageName="Service Editor">
                <MakeService />
              </PasswordProtection>
            } />
            <Route path="/makeportfolio" element={
              <PasswordProtection pageName="Portfolio Editor">
                <MakePortfolio />
              </PasswordProtection>
            } />
            <Route path="/makenews" element={
              <PasswordProtection pageName="News Editor">
                <MakeNews />
              </PasswordProtection>
            } />
            <Route path="/freelancing-tasks" element={<FreelancingTasks />} />
            <Route path="/makecontact" element={
              <PasswordProtection pageName="Contact Editor">
                <MakeContact />
              </PasswordProtection>
            } />
            <Route path="/makeprompts" element={
              <PasswordProtection pageName="Prompts Editor">
                <MakePrompts />
              </PasswordProtection>
            } />
            <Route path="/makedigitalproducts" element={
              <PasswordProtection pageName="Digital Products Editor">
                <MakeDigitalProducts />
              </PasswordProtection>
            } />
            <Route path="/makedigital-products" element={
              <PasswordProtection pageName="Digital Products Editor">
                <MakeDigitalProducts />
              </PasswordProtection>
            } />
            <Route path="/makefreelancing-tasks" element={
              <PasswordProtection pageName="Freelancing Tasks Editor">
                <MakeFreelancingTasks />
              </PasswordProtection>
            } />
            <Route path="/security" element={
              <PasswordProtection pageName="Security Manager">
                <SecurityManager />
              </PasswordProtection>
            } />
            <Route path="/makesettings" element={
              <PasswordProtection pageName="Site Settings">
                <MakeSettings />
              </PasswordProtection>
            } />
            <Route path="/make-settings" element={
              <PasswordProtection pageName="Site Settings">
                <MakeSettings />
              </PasswordProtection>
            } />
            <Route path="/settings" element={
              <PasswordProtection pageName="Site Settings">
                <MakeSettings />
              </PasswordProtection>
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

