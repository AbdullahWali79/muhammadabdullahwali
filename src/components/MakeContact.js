import React, { useState } from 'react';
import PasswordProtection from './PasswordProtection';
import { FaSave, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import './MakeContact.css';

const MakeContact = () => {
  const [contactData, setContactData] = useState({
    title: 'Get In Touch',
    subtitle: 'Let\'s work together on your next project',
    description: 'Feel free to reach out to me for any project or collaboration. I\'m always interested in new opportunities.',
    contactInfo: {
      email: 'abdullahwale@gmail.com',
      phone: '+923046983794',
      address: 'Pakistan',
      website: 'www.example.com'
    },
    socialLinks: [
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/example', icon: '💼' },
      { platform: 'Twitter', url: 'https://twitter.com/example', icon: '🐦' },
      { platform: 'GitHub', url: 'https://github.com/example', icon: '🐙' }
    ],
    formFields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email Address', type: 'email', required: true },
      { name: 'subject', label: 'Subject', type: 'text', required: true },
      { name: 'message', label: 'Message', type: 'textarea', required: true }
    ]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setContactData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactInfoChange = (field, value) => {
    setContactData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const handleSocialLinkChange = (index, field, value) => {
    setContactData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const addSocialLink = () => {
    const newLink = {
      platform: 'New Platform',
      url: 'https://example.com',
      icon: '🔗'
    };
    setContactData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newLink]
    }));
  };

  const removeSocialLink = (index) => {
    setContactData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    alert('Contact page data saved successfully!');
  };

  const ContactEditor = () => (
    <div className="make-contact">
      <div className="editor-header">
        <h1>Edit Contact Page</h1>
        <div className="editor-actions">
          <button className="btn btn-secondary" onClick={handleSave}>
            <FaSave /> Save Changes
          </button>
          <button className="btn btn-primary">
            <FaEye /> Preview
          </button>
        </div>
      </div>

      <div className="editor-content">
        <div className="form-section">
          <h2>Page Information</h2>
          <div className="form-group">
            <label>Page Title</label>
            <input
              type="text"
              name="title"
              value={contactData.title}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={contactData.subtitle}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={contactData.description}
              onChange={handleInputChange}
              rows="3"
              className="form-textarea"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Contact Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={contactData.contactInfo.email}
                onChange={(e) => handleContactInfoChange('email', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={contactData.contactInfo.phone}
                onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={contactData.contactInfo.address}
              onChange={(e) => handleContactInfoChange('address', e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Website</label>
            <input
              type="url"
              value={contactData.contactInfo.website}
              onChange={(e) => handleContactInfoChange('website', e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Social Links</h2>
          {contactData.socialLinks.map((link, index) => (
            <div key={index} className="social-link-item">
              <div className="form-row">
                <div className="form-group">
                  <label>Platform</label>
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>URL</label>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Icon (Emoji)</label>
                  <input
                    type="text"
                    value={link.icon}
                    onChange={(e) => handleSocialLinkChange(index, 'icon', e.target.value)}
                    className="form-input"
                    maxLength="2"
                  />
                </div>
                <button 
                  onClick={() => removeSocialLink(index)}
                  className="remove-btn"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          
          <button onClick={addSocialLink} className="add-social-btn">
            <FaPlus /> Add Social Link
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <PasswordProtection pageName="Contact">
      <ContactEditor />
    </PasswordProtection>
  );
};

export default MakeContact;
