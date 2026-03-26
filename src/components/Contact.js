import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';
import './Contact.css';

const Contact = ({ userData }) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create WhatsApp message
    const whatsappMessage = `Hello! I'm ${formData.name}.

Subject: ${formData.subject}

Message: ${formData.message}`;
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Your WhatsApp number
    const whatsappNumber = '923046983794';
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    setFormData({ name: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      value: userData.email,
      link: `mailto:${userData.email}`
    },
    {
      icon: FaPhone,
      title: 'Phone',
      value: userData.phone,
      link: `tel:${userData.phone}`
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Address',
      value: userData.address,
      link: `https://maps.google.com/?q=${encodeURIComponent(userData.address)}`
    },
    {
      icon: FaClock,
      title: 'Response Time',
      value: 'Within 24 hours',
      link: null
    }
  ];

  return (
    <div className="contact">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Get In Touch</h1>
          <p>I'd love to hear from you. Send me a message and I'll respond as soon as possible.</p>
        </div>
        
        <div className="contact-content">
          {/* Contact Information section hidden as it's already displayed on home page */}
          <div className="contact-info" style={{ display: 'none' }}>
            <h2>Contact Information</h2>
            <p>Feel free to reach out to me through any of the following channels:</p>
            
            <div className="info-grid">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <div key={index} className="info-item">
                    <div className="info-icon">
                      <IconComponent />
                    </div>
                    <div className="info-content">
                      <h3>{info.title}</h3>
                      {info.link ? (
                        <a href={info.link} className="info-link">
                          {info.value}
                        </a>
                      ) : (
                        <span className="info-value">{info.value}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          

          
          <div className="contact-form-section">
            <h2>Send a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="6"
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submit-btn">
                <FaPaperPlane className="btn-icon" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

