import React, { useMemo, useState } from 'react';
import {
  FaSave,
  FaUndo,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaEyeSlash,
  FaPalette,
  FaCopy
} from 'react-icons/fa';
import './MakePrompts.css';
import './MakeSettings.css';
import {
  BACKGROUND_MODE_OPTIONS,
  CURRENCY_CONFIG,
  SITE_PAGES,
  SIDEBAR_ACTIVE_STYLE_OPTIONS,
  SIDEBAR_HOVER_STYLE_OPTIONS,
  SIDEBAR_LABEL_BEHAVIOR_OPTIONS,
  SIDEBAR_MENU_DEFAULT_ORDER,
  SIDEBAR_MENU_ITEMS,
  SIDEBAR_MOBILE_MODE_OPTIONS,
  SIDEBAR_STYLE_OPTIONS,
  THEME_PRESETS,
  applyThemeSettings,
  getDefaultSiteSettings,
  getThemePresetByKey,
  getSiteSettings,
  saveSiteSettings
} from '../utils/siteSettings';

const MakeSettings = () => {
  const [settings, setSettings] = useState(() => getSiteSettings());
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const currencyOptions = useMemo(() => Object.values(CURRENCY_CONFIG), []);
  const sidebarLabelById = useMemo(
    () =>
      SIDEBAR_MENU_ITEMS.reduce((acc, item) => {
        acc[item.id] = item.label;
        return acc;
      }, {}),
    []
  );

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

  const handleSidebarChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      sidebar: {
        ...prev.sidebar,
        [field]: value
      }
    }));
  };

  const handleSidebarVisibilityChange = (menuId, visible) => {
    setSettings((prev) => ({
      ...prev,
      sidebar: {
        ...prev.sidebar,
        menuVisibility: {
          ...(prev.sidebar?.menuVisibility || {}),
          [menuId]: visible
        }
      }
    }));
  };

  const handleSidebarPositionChange = (itemId, direction) => {
    setSettings((prev) => {
      const currentOrder =
        Array.isArray(prev.sidebar?.menuOrder) && prev.sidebar.menuOrder.length > 0
          ? [...prev.sidebar.menuOrder]
          : [...SIDEBAR_MENU_DEFAULT_ORDER];
      const currentIndex = currentOrder.indexOf(itemId);
      if (currentIndex === -1) {
        return prev;
      }

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= currentOrder.length) {
        return prev;
      }

      [currentOrder[currentIndex], currentOrder[targetIndex]] = [
        currentOrder[targetIndex],
        currentOrder[currentIndex]
      ];

      return {
        ...prev,
        sidebar: {
          ...(prev.sidebar || {}),
          menuOrder: currentOrder
        }
      };
    });
  };

  const handleApplyPreset = (presetKey) => {
    const preset = getThemePresetByKey(presetKey);
    if (!preset) {
      return;
    }

    const mergedSettings = {
      ...settings,
      theme: {
        ...settings.theme,
        ...preset.theme
      },
      sidebar: {
        ...settings.sidebar,
        ...preset.sidebar
      }
    };

    const saved = saveSiteSettings(mergedSettings);
    applyThemeSettings(saved);
    window.dispatchEvent(new Event('site-settings-updated'));

    setSettings((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        ...preset.theme
      },
      sidebar: {
        ...prev.sidebar,
        ...preset.sidebar
      }
    }));

    setError('');
    setMessage(`${preset.label} theme applied to full website.`);
    setTimeout(() => setMessage(''), 3000);
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

    if (settings.sidebar.expandedWidth < 220 || settings.sidebar.expandedWidth > 420) {
      setError('Expanded sidebar width must be between 220 and 420.');
      return;
    }

    if (settings.sidebar.collapsedWidth < 64 || settings.sidebar.collapsedWidth > 220) {
      setError('Collapsed sidebar width must be between 64 and 220.');
      return;
    }

    if (settings.sidebar.collapsedWidth >= settings.sidebar.expandedWidth) {
      setError('Collapsed sidebar width must be smaller than expanded width.');
      return;
    }

    const saved = saveSiteSettings(settings);
    applyThemeSettings(saved);
    window.dispatchEvent(new Event('site-settings-updated'));
    setMessage('Settings saved successfully.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCopySettings = async () => {
    try {
      const settingsJson = JSON.stringify(settings, null, 2);
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(settingsJson);
      } else {
        throw new Error('Clipboard not supported');
      }
      setError('');
      setMessage('Settings JSON copied to clipboard.');
      setTimeout(() => setMessage(''), 3000);
    } catch (copyError) {
      setMessage('');
      setError('Unable to copy settings JSON. Please copy manually from browser devtools.');
      setTimeout(() => setError(''), 3000);
    }
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
          <button type="button" className="btn btn-secondary" onClick={handleCopySettings}>
            <FaCopy /> Copy Settings JSON
          </button>
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
          <h2>Theme Presets</h2>
          <p className="settings-note">Instantly apply a curated visual direction.</p>
          <div className="preset-grid">
            {Object.entries(THEME_PRESETS).map(([presetKey, preset]) => (
              <button
                key={presetKey}
                type="button"
                className="btn btn-secondary preset-btn"
                onClick={() => handleApplyPreset(presetKey)}
              >
                <FaPalette /> {preset.label}
              </button>
            ))}
          </div>
        </div>

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
        </div>

        <div className="form-section">
          <h2>Background Direction</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Background Mode</label>
              <select
                className="form-input form-select"
                value={settings.theme.backgroundMode}
                onChange={(e) => handleThemeChange('backgroundMode', e.target.value)}
              >
                {BACKGROUND_MODE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Gradient Angle (deg)</label>
              <input
                type="number"
                min="0"
                max="360"
                value={settings.theme.gradientAngle}
                onChange={(e) => handleThemeChange('gradientAngle', Number(e.target.value))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Motion Speed (seconds)</label>
              <input
                type="number"
                min="8"
                max="90"
                value={settings.theme.backgroundMotionSpeed}
                onChange={(e) => handleThemeChange('backgroundMotionSpeed', Number(e.target.value))}
                className="form-input"
                disabled={!settings.theme.motionEnabled}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gradient Color 1</label>
              <input
                type="color"
                value={settings.theme.gradientColorOne}
                onChange={(e) => handleThemeChange('gradientColorOne', e.target.value)}
                className="form-input color-input"
              />
            </div>
            <div className="form-group">
              <label>Gradient Color 2</label>
              <input
                type="color"
                value={settings.theme.gradientColorTwo}
                onChange={(e) => handleThemeChange('gradientColorTwo', e.target.value)}
                className="form-input color-input"
              />
            </div>
            <div className="form-group">
              <label>Gradient Color 3</label>
              <input
                type="color"
                value={settings.theme.gradientColorThree}
                onChange={(e) => handleThemeChange('gradientColorThree', e.target.value)}
                className="form-input color-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Overlay Color</label>
              <input
                type="color"
                value={settings.theme.overlayColor}
                onChange={(e) => handleThemeChange('overlayColor', e.target.value)}
                className="form-input color-input"
              />
            </div>
            <div className="form-group">
              <label>Overlay Opacity (0-0.7)</label>
              <input
                type="number"
                min="0"
                max="0.7"
                step="0.01"
                value={settings.theme.overlayOpacity}
                onChange={(e) => handleThemeChange('overlayOpacity', Number(e.target.value))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Texture Intensity (0-0.3)</label>
              <input
                type="number"
                min="0"
                max="0.3"
                step="0.01"
                value={settings.theme.textureIntensity}
                onChange={(e) => handleThemeChange('textureIntensity', Number(e.target.value))}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Pattern Opacity (0-0.65)</label>
              <input
                type="number"
                min="0"
                max="0.65"
                step="0.01"
                value={settings.theme.patternOpacity}
                onChange={(e) => handleThemeChange('patternOpacity', Number(e.target.value))}
                className="form-input"
              />
            </div>
            <div className="form-group toggle-group">
              <label>Background Motion</label>
              <button
                type="button"
                className={`toggle-chip ${settings.theme.motionEnabled ? 'enabled' : 'disabled'}`}
                onClick={() => handleThemeChange('motionEnabled', !settings.theme.motionEnabled)}
              >
                {settings.theme.motionEnabled ? <FaEye /> : <FaEyeSlash />}
                {settings.theme.motionEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Sidebar Colors</h2>
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
        </div>

        <div className="form-section">
          <h2>Sidebar Behavior</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Sidebar Style</label>
              <select
                className="form-input form-select"
                value={settings.sidebar.style}
                onChange={(e) => handleSidebarChange('style', e.target.value)}
              >
                {SIDEBAR_STYLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Active Item Style</label>
              <select
                className="form-input form-select"
                value={settings.sidebar.activeItemStyle}
                onChange={(e) => handleSidebarChange('activeItemStyle', e.target.value)}
              >
                {SIDEBAR_ACTIVE_STYLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Hover Animation</label>
              <select
                className="form-input form-select"
                value={settings.sidebar.hoverAnimation}
                onChange={(e) => handleSidebarChange('hoverAnimation', e.target.value)}
              >
                {SIDEBAR_HOVER_STYLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Label Behavior</label>
              <select
                className="form-input form-select"
                value={settings.sidebar.labelBehavior}
                onChange={(e) => handleSidebarChange('labelBehavior', e.target.value)}
              >
                {SIDEBAR_LABEL_BEHAVIOR_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Mobile Sidebar Mode</label>
              <select
                className="form-input form-select"
                value={settings.sidebar.mobileMode}
                onChange={(e) => handleSidebarChange('mobileMode', e.target.value)}
              >
                {SIDEBAR_MOBILE_MODE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Expanded Width (px)</label>
              <input
                type="number"
                min="220"
                max="420"
                value={settings.sidebar.expandedWidth}
                onChange={(e) => handleSidebarChange('expandedWidth', Number(e.target.value))}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Collapsed Width (px)</label>
              <input
                type="number"
                min="64"
                max="220"
                value={settings.sidebar.collapsedWidth}
                onChange={(e) => handleSidebarChange('collapsedWidth', Number(e.target.value))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Item Radius (px)</label>
              <input
                type="number"
                min="4"
                max="24"
                value={settings.sidebar.itemRadius}
                onChange={(e) => handleSidebarChange('itemRadius', Number(e.target.value))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Shadow Strength (0-70)</label>
              <input
                type="number"
                min="0"
                max="70"
                value={settings.sidebar.itemShadowStrength}
                onChange={(e) => handleSidebarChange('itemShadowStrength', Number(e.target.value))}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group toggle-group">
              <label>Show Profile Block</label>
              <button
                type="button"
                className={`toggle-chip ${settings.sidebar.showProfile ? 'enabled' : 'disabled'}`}
                onClick={() => handleSidebarChange('showProfile', !settings.sidebar.showProfile)}
              >
                {settings.sidebar.showProfile ? <FaEye /> : <FaEyeSlash />}
                {settings.sidebar.showProfile ? 'Visible' : 'Hidden'}
              </button>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Sidebar Menu Visibility</h2>
          <p className="settings-note">Turn menu items on or off without changing route data.</p>
          <div className="sidebar-visibility-list">
            {(settings.sidebar?.menuOrder || SIDEBAR_MENU_DEFAULT_ORDER).map((menuId) => (
              <label key={menuId} className="visibility-item">
                <span>{sidebarLabelById[menuId] || menuId}</span>
                <input
                  type="checkbox"
                  checked={settings.sidebar?.menuVisibility?.[menuId] !== false}
                  onChange={(e) => handleSidebarVisibilityChange(menuId, e.target.checked)}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Sidebar Menu Order</h2>
          <p className="settings-note">Use arrows to change sidebar menu item positions.</p>
          <div className="sidebar-order-list">
            {(settings.sidebar?.menuOrder || SIDEBAR_MENU_DEFAULT_ORDER).map((menuId, index, arr) => (
              <div key={menuId} className="sidebar-order-item">
                <span className="sidebar-order-label">{sidebarLabelById[menuId] || menuId}</span>
                <div className="sidebar-order-actions">
                  <button
                    type="button"
                    className="btn btn-secondary small-btn"
                    onClick={() => handleSidebarPositionChange(menuId, 'up')}
                    disabled={index === 0}
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary small-btn"
                    onClick={() => handleSidebarPositionChange(menuId, 'down')}
                    disabled={index === arr.length - 1}
                  >
                    <FaArrowDown />
                  </button>
                </div>
              </div>
            ))}
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

