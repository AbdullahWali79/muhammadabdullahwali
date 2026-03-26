import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaBriefcase,
  FaFolder,
  FaNewspaper,
  FaEnvelope,
  FaFileAlt,
  FaBars,
  FaTimes,
  FaRobot,
  FaShoppingCart
} from 'react-icons/fa';
import { getSidebarMenuOrder, getSiteSettings } from '../utils/siteSettings';
import './Sidebar.css';

const Sidebar = ({ userData, collapsed, setCollapsed }) => {
  const location = useLocation();
  const siteSettings = getSiteSettings();
  const sidebarSettings = siteSettings.sidebar || {};

  const sidebarStyle = sidebarSettings.style || 'solid';
  const activeItemStyle = sidebarSettings.activeItemStyle || 'pill';
  const hoverAnimation = sidebarSettings.hoverAnimation || 'lift';
  const labelBehavior = sidebarSettings.labelBehavior || 'hide-collapsed';
  const mobileMode = sidebarSettings.mobileMode || 'rail';
  const showProfile = sidebarSettings.showProfile !== false;
  const menuVisibility = sidebarSettings.menuVisibility || {};
  const shouldShowLabel =
    labelBehavior === 'always' || (labelBehavior === 'hide-collapsed' && !collapsed);
  const showTooltipOnly = labelBehavior === 'tooltip-only';
  const initials = `${userData.firstName?.charAt(0) || 'U'}${userData.lastName?.charAt(0) || ''}`;
  
  const allMenuItems = [
    { id: 'home', label: 'Home', icon: FaHome, path: '/' },
    { id: 'digital-products', label: 'Digital Products', icon: FaShoppingCart, path: '/digital-products' },
    { id: 'prompts', label: 'Prompts', icon: FaRobot, path: '/prompts' },
    { id: 'about', label: 'About', icon: FaUser, path: '/about' },
    { id: 'service', label: 'Service', icon: FaBriefcase, path: '/service' },
    { id: 'portfolio', label: 'Portfolio', icon: FaFolder, path: '/portfolio' },
    { id: 'news', label: 'News', icon: FaNewspaper, path: '/news' },
    { id: 'freelancing-tasks', label: 'Freelancing Tasks', icon: FaBriefcase, path: '/freelancing-tasks' },
    { id: 'contact', label: 'Contact', icon: FaEnvelope, path: '/contact' },
    { id: 'make-cv', label: 'Make CV', icon: FaFileAlt, path: '/makecv' }
  ];

  const menuItems = useMemo(() => {
    const order = getSidebarMenuOrder();
    const positionMap = order.reduce((acc, id, index) => {
      acc[id] = index;
      return acc;
    }, {});

    const orderedItems = [...allMenuItems].sort((a, b) => {
      const aPos = Number.isFinite(positionMap[a.id]) ? positionMap[a.id] : Number.MAX_SAFE_INTEGER;
      const bPos = Number.isFinite(positionMap[b.id]) ? positionMap[b.id] : Number.MAX_SAFE_INTEGER;
      return aPos - bPos;
    });

    // Only show "Make CV" option when on the makecv page
    const routeFilteredItems = location.pathname === '/makecv'
      ? orderedItems
      : orderedItems.filter((item) => item.id !== 'make-cv');

    return routeFilteredItems.filter((item) => menuVisibility[item.id] !== false);
  }, [location.pathname, menuVisibility]);

  return (
    <aside
      className={`sidebar ${collapsed ? 'collapsed' : ''} sidebar-style-${sidebarStyle} sidebar-active-${activeItemStyle} sidebar-hover-${hoverAnimation} sidebar-mobile-${mobileMode} sidebar-label-${labelBehavior}`}
    >
      <div className="sidebar-toggle">
        <button 
          className="toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <FaBars /> : <FaTimes />}
        </button>
      </div>
      
      {showProfile && (
        <div className="sidebar-header">
          <div className="profile-image">
            {userData.profileImage ? (
              <img src={userData.profileImage} alt="Profile" />
            ) : (
              <div className="default-avatar">{initials}</div>
            )}
          </div>
          {!collapsed && (
            <div className="profile-info">
              <h2 className="name">{userData.firstName} {userData.lastName}</h2>
              <p className="title">{userData.title}</p>
            </div>
          )}
        </div>
      )}
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={showTooltipOnly || !shouldShowLabel ? item.label : ''}
            >
              <IconComponent className="nav-icon" />
              {shouldShowLabel && !showTooltipOnly && <span className="nav-label">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;


