import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaBriefcase, FaFolder, FaNewspaper, FaEnvelope, FaFileAlt, FaBars, FaTimes, FaRobot, FaShoppingCart } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ userData, collapsed, setCollapsed }) => {
  const location = useLocation();
  
  const allMenuItems = [
    { id: 'home', label: 'Home', icon: FaHome, path: '/' },
    { id: 'digital-products', label: 'Digital Products', icon: FaShoppingCart, path: '/digital-products' },
    { id: 'prompts', label: 'Prompts', icon: FaRobot, path: '/prompts' },
    { id: 'about', label: 'About', icon: FaUser, path: '/about' },
    { id: 'service', label: 'Service', icon: FaBriefcase, path: '/service' },
    { id: 'portfolio', label: 'Portfolio', icon: FaFolder, path: '/portfolio' },
    { id: 'news', label: 'News', icon: FaNewspaper, path: '/news' },
    { id: 'contact', label: 'Contact', icon: FaEnvelope, path: '/contact' },
    { id: 'make-cv', label: 'Make CV', icon: FaFileAlt, path: '/makecv' }
  ];

  // Only show "Make CV" option when on the makecv page
  const menuItems = location.pathname === '/makecv'
    ? allMenuItems
    : allMenuItems.filter(item => item.id !== 'make-cv');

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-toggle">
        <button 
          className="toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <FaBars /> : <FaTimes />}
        </button>
      </div>
      
      <div className="sidebar-header">
        <div className="profile-image">
          {userData.profileImage ? (
            <img src={userData.profileImage} alt="Profile" />
          ) : (
            <div className="default-avatar">
              {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="profile-info">
            <h2 className="name">{userData.firstName} {userData.lastName}</h2>
            <p className="title">{userData.title}</p>
          </div>
        )}
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <IconComponent className="nav-icon" />
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

