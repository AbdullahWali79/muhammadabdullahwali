import React, { useState, useEffect, useCallback, useRef } from 'react';
import PasswordProtection from './PasswordProtection';
import GitHubImagePicker from './GitHubImagePicker';
import { FaSave, FaEye, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import { saveServiceData, getServiceData } from '../services/supabaseService';
import './MakeService.css';

// Pre-defined categories for services
const SERVICE_CATEGORIES = [
  'Web Development',
  'Mobile App Development',
  'UI/UX Design',
  'Full Stack Development',
  'Frontend Development',
  'Backend Development',
  'React Development',
  'Flutter Development',
  'Node.js Development',
  'Python Development',
  'E-commerce Development',
  'WordPress Development',
  'API Development',
  'Database Design',
  'Cloud Solutions',
  'DevOps',
  'Machine Learning',
  'Data Science',
  'SEO Services',
  'Digital Marketing',
  'Consulting',
  'Other'
];

const MakeService = () => {
  const [serviceData, setServiceData] = useState({
    title: 'My Services',
    subtitle: 'What I can do for you',
    services: [
      {
        id: 1,
        title: 'UI/UX Design',
        description: 'Creating beautiful and functional user interfaces',
        image: 'https://raw.githubusercontent.com/AbdullahWali79/AbdullahImages/main/Protfolio.jpeg',
        category: 'UI/UX Design',
        icon: '🎨',
        price: '$50/hour',
        technologies: ['Figma', 'Adobe XD', 'Sketch']
      },
      {
        id: 2,
        title: 'Web Development',
        description: 'Building responsive and modern websites',
        image: 'https://raw.githubusercontent.com/AbdullahWali79/AbdullahImages/main/Protfolio.jpeg',
        category: 'Web Development',
        icon: '💻',
        price: '$60/hour',
        technologies: ['React', 'Node.js', 'MongoDB']
      },
      {
        id: 3,
        title: 'Mobile App Design',
        description: 'Designing mobile applications for iOS and Android',
        image: 'https://raw.githubusercontent.com/AbdullahWali79/AbdullahImages/main/Protfolio.jpeg',
        category: 'Mobile App Development',
        icon: '📱',
        price: '$55/hour',
        technologies: ['Flutter', 'React Native', 'Swift']
      }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    fullDescription: '',
    image: 'https://raw.githubusercontent.com/AbdullahWali79/AbdullahImages/main/Protfolio.jpeg',
    category: '',
    icon: '⭐',
    price: '$0/hour',
    technologies: []
  });
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [autoSaving, setAutoSaving] = useState(false);
  const inputRefs = useRef({});

  // Load data from database on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await getServiceData();
        if (result.success && result.data) {
          const defaultServices = [
            {
              id: 1,
              title: 'UI/UX Design',
              description: 'Creating beautiful and functional user interfaces',
              image: 'https://raw.githubusercontent.com/AbdullahWali79/AbdullahImages/main/Protfolio.jpeg',
              category: 'UI/UX Design',
              icon: '🎨',
              price: '$50/hour',
              technologies: ['Figma', 'Adobe XD', 'Sketch']
            },
            {
              id: 2,
              title: 'Web Development',
              description: 'Building responsive and modern websites',
              image: 'https://raw.githubusercontent.com/AbdullahWali79/AbdullahImages/main/Protfolio.jpeg',
              category: 'Web Development',
              icon: '💻',
              price: '$60/hour',
              technologies: ['React', 'Node.js', 'MongoDB']
            },
            {
              id: 3,
              title: 'Mobile App Design',
              description: 'Designing mobile applications for iOS and Android',
              image: 'https://raw.githubusercontent.com/AbdullahWali79/AbdullahImages/main/Protfolio.jpeg',
              category: 'Mobile App Development',
              icon: '📱',
              price: '$55/hour',
              technologies: ['Flutter', 'React Native', 'Swift']
            }
          ];
          setServiceData({
            title: result.data.title || 'My Services',
            subtitle: result.data.subtitle || 'What I can do for you',
            services: result.data.services || defaultServices
          });
        }
      } catch (error) {
        console.error('Error loading service data:', error);
        setMessage('Error loading data. Using defaults.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setServiceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceChange = (id, field, value, event) => {
    // Prevent default behavior that might cause scroll
    if (event) {
      event.preventDefault();
    }
    
    setServiceData(prev => ({
      ...prev,
      services: prev.services.map(service => 
        service.id === id ? { ...service, [field]: value } : service
      )
    }));
  };

  const handleImageSelect = (id, imageUrl) => {
    handleServiceChange(id, 'image', imageUrl);
  };

  const openModal = useCallback(() => {
    setNewService({
      title: '',
      description: '',
      fullDescription: '',
      image: 'https://raw.githubusercontent.com/AbdullahWali79/AbdullahImages/main/Protfolio.jpeg',
      category: '',
      icon: '⭐',
      price: '$0/hour',
      technologies: []
    });
    setShowCustomCategory(false);
    setCustomCategory('');
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setNewService({
      title: '',
      description: '',
      fullDescription: '',
      image: 'https://raw.githubusercontent.com/AbdullahWali79/AbdullahImages/main/Protfolio.jpeg',
      category: '',
      icon: '⭐',
      price: '$0/hour',
      technologies: []
    });
    setShowCustomCategory(false);
    setCustomCategory('');
  }, []);

  const handleNewServiceChange = (field, value) => {
    setNewService(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveNewService = async () => {
    if (!newService.title.trim()) {
      setMessage('Please enter a service title');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    setAutoSaving(true);
    setMessage('Saving to Supabase...');
    try {
      const serviceToAdd = {
        id: Date.now(),
        ...newService,
        technologies: Array.isArray(newService.technologies) 
          ? newService.technologies 
          : (typeof newService.technologies === 'string' && newService.technologies.trim()
              ? newService.technologies.split(',').map(t => t.trim()).filter(t => t)
              : [])
      };

      const updatedServiceData = {
        ...serviceData,
        services: [...serviceData.services, serviceToAdd]
      };

      const result = await saveServiceData(updatedServiceData);
      if (result.success) {
        setServiceData(updatedServiceData);
        setMessage('Service saved successfully to Supabase!');
        closeModal();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving service:', error);
      setMessage(`Error saving: ${error.message}`);
    } finally {
      setAutoSaving(false);
    }
  };

  const addService = useCallback(() => {
    openModal();
  }, [openModal]);

  const removeService = (id) => {
    setServiceData(prev => ({
      ...prev,
      services: prev.services.filter(service => service.id !== id)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const result = await saveServiceData(serviceData);
      if (result.success) {
        setMessage('Service page data saved successfully!');
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving service data:', error);
      setMessage(`Error saving data: ${error.message}`);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const ServiceEditor = () => (
    <div className="make-service">
      <div className="editor-header">
        <h1>Edit Service Page</h1>
        <div className="editor-actions">
          <button 
            className="btn btn-secondary" 
            onClick={handleSave}
            disabled={saving || loading}
          >
            <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button"
            className="btn btn-primary" 
            onClick={addService}
          >
            <FaPlus /> Add New Service
          </button>
          <button className="btn btn-primary">
            <FaEye /> Preview
          </button>
        </div>
      </div>
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
      {loading && <div className="loading">Loading data...</div>}

      <div className="editor-content">
        <div className="form-section">
          <h2>Page Information</h2>
          <div className="form-group">
            <label>Page Title</label>
            <input
              type="text"
              name="title"
              value={serviceData.title}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={serviceData.subtitle}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Services</h2>
          {serviceData.services.map((service) => (
            <div key={service.id} className="service-item">
              <div className="service-header">
                <h3>Service #{service.id}</h3>
                <button 
                  onClick={() => removeService(service.id)}
                  className="remove-btn"
                >
                  <FaTrash />
                </button>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Service Title</label>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleServiceChange(service.id, 'title', e.target.value, e);
                    }}
                    onFocus={(e) => {
                      e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={service.category || ''}
                    onChange={(e) => {
                      e.stopPropagation();
                      const value = e.target.value;
                      if (value === 'custom') {
                        handleServiceChange(service.id, 'category', '', e);
                      } else {
                        handleServiceChange(service.id, 'category', value, e);
                      }
                    }}
                    onFocus={(e) => {
                      e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }}
                    className="form-input form-select"
                  >
                    <option value="">Select Category</option>
                    {SERVICE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="custom">+ Add Custom Category</option>
                  </select>
                  {service.category && !SERVICE_CATEGORIES.includes(service.category) && (
                    <input
                      type="text"
                      value={service.category}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleServiceChange(service.id, 'category', e.target.value, e);
                      }}
                      className="form-input"
                      style={{ marginTop: '8px' }}
                      placeholder="Enter custom category"
                    />
                  )}
                </div>
                <div className="form-group">
                  <label>Icon (Emoji)</label>
                  <input
                    type="text"
                    value={service.icon || '⭐'}
                    onChange={(e) => handleServiceChange(service.id, 'icon', e.target.value, e)}
                    className="form-input"
                    maxLength="2"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="text"
                    value={service.price}
                    onChange={(e) => handleServiceChange(service.id, 'price', e.target.value, e)}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Short Description (for card view)</label>
                <textarea
                  value={service.description}
                  onChange={(e) => handleServiceChange(service.id, 'description', e.target.value, e)}
                  rows="2"
                  className="form-textarea"
                />
              </div>
              
              <div className="form-group">
                <label>Full Description / Details (for detail page)</label>
                <textarea
                  value={service.fullDescription || ''}
                  onChange={(e) => handleServiceChange(service.id, 'fullDescription', e.target.value, e)}
                  rows="8"
                  className="form-textarea"
                  placeholder="Enter complete service description, details, or information that will display on the service detail page..."
                />
                <small style={{ color: '#B0B0B0', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  This full description will be displayed on the service detail page when users click on a service.
                </small>
              </div>
              
              <div className="form-group">
                <label>Technologies (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(service.technologies) ? service.technologies.join(', ') : ''}
                  onChange={(e) => handleServiceChange(service.id, 'technologies', e.target.value.split(', ').filter(t => t.trim()), e)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <GitHubImagePicker
                  label={`Service Image - ${service.title}`}
                  currentImage={service.image}
                  onImageSelect={(imageUrl) => handleImageSelect(service.id, imageUrl)}
                />
              </div>
            </div>
          ))}
          
          <button onClick={addService} className="add-service-btn">
            <FaPlus /> Add New Service
          </button>
        </div>
      </div>

      {/* Modal for Adding New Service */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Service</h2>
              <button className="modal-close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Service Title *</label>
                <input
                  type="text"
                  value={newService.title}
                  onChange={(e) => handleNewServiceChange('title', e.target.value)}
                  className="form-input"
                  placeholder="Enter service title"
                  autoFocus
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newService.category || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'custom') {
                        setShowCustomCategory(true);
                        setCustomCategory('');
                        handleNewServiceChange('category', '');
                      } else {
                        setShowCustomCategory(false);
                        handleNewServiceChange('category', value);
                      }
                    }}
                    className="form-input form-select"
                  >
                    <option value="">Select Category</option>
                    {SERVICE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="custom">+ Add Custom Category</option>
                  </select>
                  {showCustomCategory && (
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCustomCategory(value);
                        handleNewServiceChange('category', value);
                      }}
                      className="form-input"
                      style={{ marginTop: '8px' }}
                      placeholder="Enter custom category"
                      autoFocus
                    />
                  )}
                </div>
                <div className="form-group">
                  <label>Icon (Emoji)</label>
                  <input
                    type="text"
                    value={newService.icon}
                    onChange={(e) => handleNewServiceChange('icon', e.target.value)}
                    className="form-input"
                    maxLength="2"
                    placeholder="⭐"
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="text"
                    value={newService.price}
                    onChange={(e) => handleNewServiceChange('price', e.target.value)}
                    className="form-input"
                    placeholder="$50/hour"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Short Description (for card view)</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => handleNewServiceChange('description', e.target.value)}
                  rows="3"
                  className="form-textarea"
                  placeholder="Brief description that appears on service cards..."
                />
              </div>
              
              <div className="form-group">
                <label>Full Description / Details (for detail page)</label>
                <textarea
                  value={newService.fullDescription}
                  onChange={(e) => handleNewServiceChange('fullDescription', e.target.value)}
                  rows="6"
                  className="form-textarea"
                  placeholder="Complete service description, details, or information..."
                />
              </div>
              
              <div className="form-group">
                <label>Technologies (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(newService.technologies) ? newService.technologies.join(', ') : newService.technologies}
                  onChange={(e) => handleNewServiceChange('technologies', e.target.value)}
                  className="form-input"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              
              <div className="form-group">
                <GitHubImagePicker
                  label="Service Image"
                  currentImage={newService.image}
                  onImageSelect={(imageUrl) => handleNewServiceChange('image', imageUrl)}
                />
              </div>
              
              {autoSaving && (
                <div className="auto-save-indicator">
                  <small>Saving to Supabase...</small>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSaveNewService}
                disabled={autoSaving || !newService.title.trim()}
              >
                {autoSaving ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <PasswordProtection pageName="Service">
      <ServiceEditor />
    </PasswordProtection>
  );
};

export default MakeService;
