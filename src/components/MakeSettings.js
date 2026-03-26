import React, { useMemo, useState } from 'react';
import { FaSave, FaUndo } from 'react-icons/fa';
import './MakePrompts.css';
import './MakeSettings.css';
import {
  CURRENCY_CONFIG,
  SITE_PAGES,
  applyThemeSettings,
  getDefaultSiteSettings,
  getSiteSettings,
  saveSiteSettings
} from '../utils/siteSettings';

const MakeSettings = () => {
  const [settings, setSettings] = useState(() => getSiteSettings());
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const currencyOptions = useMemo(() => Object.values(CURRENCY_CONFIG), []);

  const handleThemeChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        [field]: value
      }
    }));
  };

  const handleCurrencyChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      currency: {
        ...prev.currency,
        [field]: value
      }
    }));
  };

  const handlePageCurrencyChange = (pageKey, value) => {
    setSettings((prev) => ({
      ...prev,
      currency: {
        ...prev.currency,
        byPage: {
          ...prev.currency.byPage,
          [pageKey]: value
        }
      }
    }));
  };

  const handleSave = () => {
    setError('');
    setMessage('');

    if (settings.theme.baseFontSize < 12 || settings.theme.baseFontSize > 24) {
      setError('Base font size must be between 12 and 24.');
      return;
    }

    if (settings.theme.maxContentWidth < 800 || settings.theme.maxContentWidth > 2200) {
      setError('Max content width must be between 800 and 2200.');
      return;
    }

    const saved = saveSiteSettings(settings);
    applyThemeSettings(saved);
    window.dispatchEvent(new Event('site-settings-updated'));
    setMessage('Settings saved successfully.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleReset = () => {
    const defaults = getDefaultSiteSettings();
    setSettings(defaults);
    saveSiteSettings(defaults);
    applyThemeSettings(defaults);
    window.dispatchEvent(new Event('site-settings-updated'));
    setError('');
    setMessage('Settings reset to default.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="make-prompts make-settings-page">
      <div className="editor-header">
        <h1>Site Settings</h1>
        <div className="editor-actions">
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            <FaUndo /> Reset
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            <FaSave /> Save Settings
          </button>
        </div>
      </div>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <div className="editor-content settings-editor-content">
        <div className="form-section">
          <h2>Theme & Layout</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Background Color</label>
              <input
                type="color"
                value={settings.theme.backgroundColor}
                onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                className="form-input color-input"
              />
            </div>
            <div className="form-group">
              <label>Surface Color</label>
              <input
                type="color"
                value={settings.theme.surfaceColor}
                onChange={(e) => handleThemeChange('surfaceColor', e.target.value)}
                className="form-input color-input"
              />
            </div>
            <div className="form-group">
              <label>Text Color</label>
              <input
                type="color"
                value={settings.theme.textColor}
                onChange={(e) => handleThemeChange('textColor', e.target.value)}
                className="form-input color-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Accent Color</label>
              <input
                type="color"
                value={settings.theme.accentColor}
                onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                className="form-input color-input"
              />
            </div>
            <div className="form-group">
              <label>Base Font Size (px)</label>
              <input
                type="number"
                min="12"
                max="24"
                value={settings.theme.baseFontSize}
                onChange={(e) => handleThemeChange('baseFontSize', Number(e.target.value))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Max Content Width (px)</label>
              <input
                type="number"
                min="800"
                max="2200"
                value={settings.theme.maxContentWidth}
                onChange={(e) => handleThemeChange('maxContentWidth', Number(e.target.value))}
                className="form-input"
              />
            </div>
          </div>

          <h2 style={{ marginTop: '10px' }}>Sidebar Colors</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Sidebar Background</label>
              <input
                type="color"
                value={settings.theme.sidebarBackgroundColor}
                onChange={(e) => handleThemeChange('sidebarBackgroundColor', e.target.value)}
                className="form-input color-input"
              />
            </div>
            <div className="form-group">
              <label>Sidebar Border</label>
              <input
                type="color"
                value={settings.theme.sidebarBorderColor}
                onChange={(e) => handleThemeChange('sidebarBorderColor', e.target.value)}
                className="form-input color-input"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Sidebar Text</label>
              <input
                type="color"
                value={settings.theme.sidebarTextColor}
                onChange={(e) => handleThemeChange('sidebarTextColor', e.target.value)}
                className="form-input color-input"
              />
            </div>
            <div className="form-group">
              <label>Sidebar Muted Text</label>
              <input
                type="color"
                value={settings.theme.sidebarMutedTextColor}
                onChange={(e) => handleThemeChange('sidebarMutedTextColor', e.target.value)}
                className="form-input color-input"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Sidebar Item Background</label>
              <input
                type="color"
                value={settings.theme.sidebarItemBackgroundColor}
                onChange={(e) => handleThemeChange('sidebarItemBackgroundColor', e.target.value)}
                className="form-input color-input"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Currency Settings</h2>
          <div className="form-group">
            <label>Default Currency (All pages)</label>
            <select
              className="form-input form-select"
              value={settings.currency.default}
              onChange={(e) => handleCurrencyChange('default', e.target.value)}
            >
              {currencyOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="settings-grid">
            {SITE_PAGES.map((page) => (
              <div key={page.key} className="settings-grid-item">
                <label>{page.label}</label>
                <select
                  className="form-input form-select"
                  value={settings.currency.byPage?.[page.key] || 'default'}
                  onChange={(e) => handlePageCurrencyChange(page.key, e.target.value)}
                >
                  <option value="default">Use Default</option>
                  {currencyOptions.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Access Note</h2>
          <p className="settings-note">
            This page is intended for admin use only and is available through a protected route.
          </p>
          <code className="settings-route">/#/makesettings</code>
        </div>
      </div>
    </div>
  );
};

export default MakeSettings;
