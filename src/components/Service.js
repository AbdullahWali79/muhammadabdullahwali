import React, { useState, useEffect } from 'react';
import { FaPalette, FaCode, FaMobile, FaSearch, FaRocket, FaUsers } from 'react-icons/fa';
import { getServiceData } from '../services/supabaseService';
import './Service.css';

const Service = () => {
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServiceData = async () => {
      try {
        const result = await getServiceData();
        if (result.success && result.data) {
          setServiceData(result.data);
        }
      } catch (error) {
        console.error('Error loading service data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadServiceData();
  }, []);

  if (loading) {
    return (
      <div className="service">
        <div className="service-container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  const displayTitle = serviceData?.title || 'My Services';
  const displaySubtitle = serviceData?.subtitle || 'Comprehensive solutions for your digital needs';
  const services = serviceData?.services || [];

  // Default services if none found
  const defaultServices = [
    {
      icon: FaPalette,
      title: 'UI/UX Design',
      description: 'Creating beautiful and intuitive user interfaces that provide exceptional user experiences.',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design']
    },
    {
      icon: FaCode,
      title: 'Web Development',
      description: 'Building responsive and modern websites using the latest technologies and best practices.',
      features: ['Frontend Development', 'Backend Integration', 'Responsive Design', 'Performance Optimization']
    },
    {
      icon: FaMobile,
      title: 'Mobile App Design',
      description: 'Designing mobile applications that are both functional and visually appealing across all devices.',
      features: ['iOS Design', 'Android Design', 'Cross-platform', 'App Store Optimization']
    }
  ];

  const iconMap = {
    '🎨': FaPalette,
    '💻': FaCode,
    '📱': FaMobile,
    '🔍': FaSearch,
    '🚀': FaRocket,
    '👥': FaUsers,
    '⭐': FaRocket,
    '💡': FaCode
  };

  const displayServices = services.length > 0 
    ? services.map(service => ({
        ...service,
        icon: typeof service.icon === 'string' 
          ? (iconMap[service.icon] || FaCode)
          : service.icon || FaCode,
        features: service.features || []
      }))
    : defaultServices;

  return (
    <div className="service">
      <div className="service-container">
        <div className="service-header">
          <h1>{displayTitle}</h1>
          <p>{displaySubtitle}</p>
        </div>
        
        <div className="services-grid">
          {displayServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={service.id || index} className="service-card">
                <div className="service-icon">
                  <IconComponent />
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                {service.price && (
                  <div className="service-price">{service.price}</div>
                )}
                {service.features && service.features.length > 0 && (
                  <ul className="service-features">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>{feature}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="service-cta">
          <h2>Ready to work together?</h2>
          <p>Let's discuss your project and create something amazing together.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              const whatsappNumber = '923046983794';
              const whatsappUrl = `https://wa.me/${whatsappNumber}`;
              window.open(whatsappUrl, '_blank');
            }}
          >
            Get In Touch
          </button>
        </div>
      </div>
    </div>
  );
};

export default Service;

