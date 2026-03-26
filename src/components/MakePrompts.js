import React, { useState, useEffect } from 'react';
import PasswordProtection from './PasswordProtection';
import { FaSave, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import { savePromptsData, getPromptsData } from '../services/supabaseService';
import './MakePrompts.css';

const MakePrompts = () => {
  const [promptsData, setPromptsData] = useState({
    title: 'Prompt Engineering',
    subtitle: 'Explore my top-performing system prompts',
    prompts: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Load data from database on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await getPromptsData();
        if (result.success && result.data) {
          setPromptsData({
            title: result.data.title || 'Prompt Engineering',
            subtitle: result.data.subtitle || 'Explore my top-performing system prompts',
            prompts: result.data.prompts || []
          });
        }
      } catch (error) {
        console.error('Error loading prompts data:', error);
        setMessage('Error loading data. Using defaults.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setPromptsData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePromptChange = (id, field, value) => {
    setPromptsData(prev => ({
      ...prev,
      prompts: prev.prompts.map(prompt =>
        prompt.id === id ? { ...prompt, [field]: value } : prompt
      )
    }));
  };

  const addPrompt = () => {
    const newPrompt = {
      id: Date.now(),
      title: 'New Prompt',
      category: 'General',
      description: 'Brief description of what this prompt does...',
      youtubeUrl: '',
      content: 'You are an AI assistant designed to...'
    };
    setPromptsData(prev => ({
      ...prev,
      prompts: [...prev.prompts, newPrompt]
    }));
  };

  const removePrompt = (id) => {
    setPromptsData(prev => ({
      ...prev,
      prompts: prev.prompts.filter(prompt => prompt.id !== id)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const result = await savePromptsData(promptsData);
      if (result.success) {
        setMessage('Prompts page data saved successfully!');
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving prompts data:', error);
      setMessage(`Error saving data: ${error.message}`);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <PasswordProtection pageName="Prompts">
      <div className="make-prompts">
        <div className="editor-header">
          <h1>Edit Prompts Page</h1>
          <div className="editor-actions">
            <button className="btn btn-primary" onClick={addPrompt}>
              <FaPlus /> Add New Prompt
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleSave}
              disabled={saving || loading}
            >
              <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
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
                value={promptsData.title}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={promptsData.subtitle}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Prompts Library</h2>
            <datalist id="category-suggestions">
              {[...new Set(promptsData.prompts.map(p => p.category).filter(Boolean))].map((cat, index) => (
                <option key={index} value={cat} />
              ))}
            </datalist>
            {promptsData.prompts.map((prompt) => (
              <div key={prompt.id} className="prompt-item">
                <div className="prompt-header">
                  <h3>Prompt #{prompt.id}</h3>
                  <div className="prompt-controls">
                    <button
                      onClick={() => removePrompt(prompt.id)}
                      className="remove-btn"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Prompt Title</label>
                    <input
                      type="text"
                      value={prompt.title}
                      onChange={(e) => handlePromptChange(prompt.id, 'title', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      list="category-suggestions"
                      value={prompt.category}
                      onChange={(e) => handlePromptChange(prompt.id, 'category', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>YouTube Video URL (e.g., https://youtube.com/watch?v=...)</label>
                  <input
                    type="text"
                    value={prompt.youtubeUrl}
                    onChange={(e) => handlePromptChange(prompt.id, 'youtubeUrl', e.target.value)}
                    className="form-input"
                    placeholder="Provide a valid YouTube link"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={prompt.description}
                    onChange={(e) => handlePromptChange(prompt.id, 'description', e.target.value)}
                    rows="2"
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label>Actual Prompt Content</label>
                  <textarea
                    value={prompt.content}
                    onChange={(e) => handlePromptChange(prompt.id, 'content', e.target.value)}
                    rows="5"
                    className="form-textarea"
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>
              </div>
            ))}

            <button onClick={addPrompt} className="add-prompt-btn">
              <FaPlus /> Add New Prompt
            </button>
          </div>
        </div>
      </div>
    </PasswordProtection>
  );
};

export default MakePrompts;
