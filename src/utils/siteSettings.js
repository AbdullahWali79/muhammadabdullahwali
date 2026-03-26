const SETTINGS_STORAGE_KEY = 'siteSettings.v1';

export const CURRENCY_CONFIG = {
  PKR: { code: 'PKR', label: 'Rupee (Rs)', symbol: 'Rs', spaceAfterSymbol: true },
  USD: { code: 'USD', label: 'Dollar ($)', symbol: '$', spaceAfterSymbol: false },
  EUR: { code: 'EUR', label: 'Euro (EUR)', symbol: 'EUR', spaceAfterSymbol: true },
  GBP: { code: 'GBP', label: 'Pound (GBP)', symbol: 'GBP', spaceAfterSymbol: true }
};

export const SITE_PAGES = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'service', label: 'Service' },
  { key: 'portfolio', label: 'Portfolio' },
  { key: 'news', label: 'News' },
  { key: 'contact', label: 'Contact' },
  { key: 'prompts', label: 'Prompts' },
  { key: 'digital-products', label: 'Digital Products' },
  { key: 'freelancing-tasks', label: 'Freelancing Tasks' }
];

export const SIDEBAR_MENU_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'digital-products', label: 'Digital Products' },
  { id: 'prompts', label: 'Prompts' },
  { id: 'about', label: 'About' },
  { id: 'service', label: 'Service' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'news', label: 'News' },
  { id: 'freelancing-tasks', label: 'Freelancing Tasks' },
  { id: 'contact', label: 'Contact' },
  { id: 'make-cv', label: 'Make CV' }
];

export const SIDEBAR_MENU_DEFAULT_ORDER = SIDEBAR_MENU_ITEMS.map((item) => item.id);

export const BACKGROUND_MODE_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'mesh', label: 'Mesh Gradient' },
  { value: 'pattern', label: 'Pattern' }
];

export const SIDEBAR_STYLE_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'glass', label: 'Glass' },
  { value: 'floating', label: 'Floating' }
];

export const SIDEBAR_ACTIVE_STYLE_OPTIONS = [
  { value: 'pill', label: 'Pill' },
  { value: 'left-bar', label: 'Left Bar' },
  { value: 'glow', label: 'Glow Ring' },
  { value: 'underline', label: 'Underline' }
];

export const SIDEBAR_HOVER_STYLE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'lift', label: 'Lift' },
  { value: 'glow', label: 'Glow' },
  { value: 'slide', label: 'Slide' }
];

export const SIDEBAR_LABEL_BEHAVIOR_OPTIONS = [
  { value: 'hide-collapsed', label: 'Hide In Collapsed' },
  { value: 'always', label: 'Always Show' },
  { value: 'tooltip-only', label: 'Tooltip Only' }
];

export const SIDEBAR_MOBILE_MODE_OPTIONS = [
  { value: 'rail', label: 'Top Icon Rail' },
  { value: 'grid', label: 'Top Card Grid' }
];

export const THEME_PRESETS = {
  cyberTeal: {
    label: 'Cyber Teal',
    theme: {
      backgroundColor: '#0F1721',
      surfaceColor: '#1A2736',
      textColor: '#E7F8FA',
      accentColor: '#00CED1',
      sidebarBackgroundColor: '#0F1721',
      sidebarBorderColor: '#224055',
      sidebarTextColor: '#FFFFFF',
      sidebarMutedTextColor: '#8CB8C4',
      sidebarItemBackgroundColor: '#183042',
      backgroundMode: 'mesh',
      gradientAngle: 130,
      gradientColorOne: '#0F1721',
      gradientColorTwo: '#163146',
      gradientColorThree: '#215370',
      patternOpacity: 0.12,
      overlayColor: '#05080C',
      overlayOpacity: 0.32,
      textureIntensity: 0.08,
      backgroundMotionSpeed: 24,
      motionEnabled: true
    },
    sidebar: {
      style: 'glass',
      activeItemStyle: 'glow',
      hoverAnimation: 'glow',
      itemRadius: 12,
      itemShadowStrength: 34
    }
  },
  midnightSlate: {
    label: 'Midnight Slate',
    theme: {
      backgroundColor: '#12141A',
      surfaceColor: '#1C202B',
      textColor: '#F4F6FA',
      accentColor: '#5EC4FF',
      sidebarBackgroundColor: '#11131A',
      sidebarBorderColor: '#2A3040',
      sidebarTextColor: '#F8FAFC',
      sidebarMutedTextColor: '#98A3B8',
      sidebarItemBackgroundColor: '#1D2330',
      backgroundMode: 'gradient',
      gradientAngle: 145,
      gradientColorOne: '#10131A',
      gradientColorTwo: '#1A2230',
      gradientColorThree: '#2A3444',
      patternOpacity: 0.08,
      overlayColor: '#050507',
      overlayOpacity: 0.28,
      textureIntensity: 0.05,
      backgroundMotionSpeed: 28,
      motionEnabled: true
    },
    sidebar: {
      style: 'floating',
      activeItemStyle: 'left-bar',
      hoverAnimation: 'lift',
      itemRadius: 10,
      itemShadowStrength: 40
    }
  },
  warmEditorial: {
    label: 'Warm Editorial',
    theme: {
      backgroundColor: '#1F1713',
      surfaceColor: '#2C231D',
      textColor: '#FFF4E8',
      accentColor: '#F59E52',
      sidebarBackgroundColor: '#221A15',
      sidebarBorderColor: '#4A372B',
      sidebarTextColor: '#FFF6ED',
      sidebarMutedTextColor: '#D7BA9F',
      sidebarItemBackgroundColor: '#35281F',
      backgroundMode: 'pattern',
      gradientAngle: 120,
      gradientColorOne: '#1A120F',
      gradientColorTwo: '#2A1D18',
      gradientColorThree: '#473327',
      patternOpacity: 0.19,
      overlayColor: '#120C08',
      overlayOpacity: 0.25,
      textureIntensity: 0.1,
      backgroundMotionSpeed: 34,
      motionEnabled: false
    },
    sidebar: {
      style: 'solid',
      activeItemStyle: 'underline',
      hoverAnimation: 'slide',
      itemRadius: 14,
      itemShadowStrength: 26
    }
  },
  emeraldNoir: {
    label: 'Emerald Noir',
    theme: {
      backgroundColor: '#0C1612',
      surfaceColor: '#16251F',
      textColor: '#ECFFF6',
      accentColor: '#2ED39A',
      sidebarBackgroundColor: '#0B1511',
      sidebarBorderColor: '#27493D',
      sidebarTextColor: '#F2FFF9',
      sidebarMutedTextColor: '#9AC5B5',
      sidebarItemBackgroundColor: '#1B312A',
      backgroundMode: 'gradient',
      gradientAngle: 132,
      gradientColorOne: '#0A1410',
      gradientColorTwo: '#153127',
      gradientColorThree: '#245541',
      patternOpacity: 0.1,
      overlayColor: '#040806',
      overlayOpacity: 0.26,
      textureIntensity: 0.08,
      backgroundMotionSpeed: 26,
      motionEnabled: true
    },
    sidebar: {
      style: 'glass',
      activeItemStyle: 'glow',
      hoverAnimation: 'glow',
      itemRadius: 12,
      itemShadowStrength: 32
    }
  },
  royalBurgundy: {
    label: 'Royal Burgundy',
    theme: {
      backgroundColor: '#1A1115',
      surfaceColor: '#281922',
      textColor: '#FFF3FA',
      accentColor: '#D95C94',
      sidebarBackgroundColor: '#170E12',
      sidebarBorderColor: '#4A2739',
      sidebarTextColor: '#FFEFF8',
      sidebarMutedTextColor: '#CF9FB7',
      sidebarItemBackgroundColor: '#36202D',
      backgroundMode: 'pattern',
      gradientAngle: 135,
      gradientColorOne: '#170E12',
      gradientColorTwo: '#2B1822',
      gradientColorThree: '#4D273B',
      patternOpacity: 0.14,
      overlayColor: '#080406',
      overlayOpacity: 0.24,
      textureIntensity: 0.08,
      backgroundMotionSpeed: 30,
      motionEnabled: true
    },
    sidebar: {
      style: 'floating',
      activeItemStyle: 'left-bar',
      hoverAnimation: 'slide',
      itemRadius: 14,
      itemShadowStrength: 36
    }
  },
  arcticGlass: {
    label: 'Arctic Glass',
    theme: {
      backgroundColor: '#0E1B25',
      surfaceColor: '#1B2D3B',
      textColor: '#EAF7FF',
      accentColor: '#6DD3FF',
      sidebarBackgroundColor: '#0D1820',
      sidebarBorderColor: '#2F4D61',
      sidebarTextColor: '#F2FAFF',
      sidebarMutedTextColor: '#9CB9CB',
      sidebarItemBackgroundColor: '#213746',
      backgroundMode: 'mesh',
      gradientAngle: 142,
      gradientColorOne: '#0E1A24',
      gradientColorTwo: '#1A3345',
      gradientColorThree: '#29516B',
      patternOpacity: 0.08,
      overlayColor: '#04070A',
      overlayOpacity: 0.22,
      textureIntensity: 0.06,
      backgroundMotionSpeed: 22,
      motionEnabled: true
    },
    sidebar: {
      style: 'glass',
      activeItemStyle: 'pill',
      hoverAnimation: 'lift',
      itemRadius: 10,
      itemShadowStrength: 28
    }
  },
  sunsetCopper: {
    label: 'Sunset Copper',
    theme: {
      backgroundColor: '#21130C',
      surfaceColor: '#332016',
      textColor: '#FFF4EB',
      accentColor: '#FF965C',
      sidebarBackgroundColor: '#1C110B',
      sidebarBorderColor: '#5A3A28',
      sidebarTextColor: '#FFF5EC',
      sidebarMutedTextColor: '#D9B69D',
      sidebarItemBackgroundColor: '#462B1E',
      backgroundMode: 'gradient',
      gradientAngle: 128,
      gradientColorOne: '#1B100A',
      gradientColorTwo: '#3A2418',
      gradientColorThree: '#6A3F2B',
      patternOpacity: 0.1,
      overlayColor: '#090503',
      overlayOpacity: 0.2,
      textureIntensity: 0.08,
      backgroundMotionSpeed: 28,
      motionEnabled: true
    },
    sidebar: {
      style: 'solid',
      activeItemStyle: 'underline',
      hoverAnimation: 'slide',
      itemRadius: 12,
      itemShadowStrength: 30
    }
  },
  monoNeon: {
    label: 'Mono Neon',
    theme: {
      backgroundColor: '#111214',
      surfaceColor: '#1B1D22',
      textColor: '#F5F8FF',
      accentColor: '#00F0FF',
      sidebarBackgroundColor: '#101114',
      sidebarBorderColor: '#2D323D',
      sidebarTextColor: '#F7FAFF',
      sidebarMutedTextColor: '#A8B2C2',
      sidebarItemBackgroundColor: '#21252D',
      backgroundMode: 'mesh',
      gradientAngle: 140,
      gradientColorOne: '#101114',
      gradientColorTwo: '#1D2430',
      gradientColorThree: '#303D50',
      patternOpacity: 0.08,
      overlayColor: '#030406',
      overlayOpacity: 0.26,
      textureIntensity: 0.06,
      backgroundMotionSpeed: 24,
      motionEnabled: true
    },
    sidebar: {
      style: 'floating',
      activeItemStyle: 'glow',
      hoverAnimation: 'glow',
      itemRadius: 9,
      itemShadowStrength: 42
    }
  }
};

const VALID_BACKGROUND_MODES = new Set(BACKGROUND_MODE_OPTIONS.map((option) => option.value));
const VALID_SIDEBAR_STYLES = new Set(SIDEBAR_STYLE_OPTIONS.map((option) => option.value));
const VALID_SIDEBAR_ACTIVE_STYLES = new Set(SIDEBAR_ACTIVE_STYLE_OPTIONS.map((option) => option.value));
const VALID_SIDEBAR_HOVER_STYLES = new Set(SIDEBAR_HOVER_STYLE_OPTIONS.map((option) => option.value));
const VALID_SIDEBAR_LABEL_BEHAVIORS = new Set(SIDEBAR_LABEL_BEHAVIOR_OPTIONS.map((option) => option.value));
const VALID_SIDEBAR_MOBILE_MODES = new Set(SIDEBAR_MOBILE_MODE_OPTIONS.map((option) => option.value));

const buildDefaultPageCurrencyMap = () =>
  SITE_PAGES.reduce((acc, page) => {
    acc[page.key] = 'default';
    return acc;
  }, {});

const buildDefaultSidebarVisibilityMap = () =>
  SIDEBAR_MENU_DEFAULT_ORDER.reduce((acc, id) => {
    acc[id] = true;
    return acc;
  }, {});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const sanitizeNumber = (value, fallback, min, max) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return clamp(parsed, min, max);
};

const sanitizeEnum = (value, fallback, validSet) => (validSet.has(value) ? value : fallback);

const sanitizeBoolean = (value, fallback) => {
  if (typeof value === 'boolean') {
    return value;
  }
  return fallback;
};

const sanitizeColor = (value, fallback) => {
  if (typeof value !== 'string') {
    return fallback;
  }
  const normalized = value.trim();
  if (/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(normalized)) {
    return normalized;
  }
  return fallback;
};

const normalizeSidebarMenuOrder = (order) => {
  const validSidebarIds = new Set(SIDEBAR_MENU_DEFAULT_ORDER);
  const customMenuOrder = Array.isArray(order) ? order.filter((id) => validSidebarIds.has(id)) : [];
  const uniqueMenuOrder = [...new Set(customMenuOrder)];

  return [
    ...uniqueMenuOrder,
    ...SIDEBAR_MENU_DEFAULT_ORDER.filter((id) => !uniqueMenuOrder.includes(id))
  ];
};

const normalizeMenuVisibility = (menuVisibility) => {
  const defaults = buildDefaultSidebarVisibilityMap();

  if (!menuVisibility || typeof menuVisibility !== 'object') {
    return defaults;
  }

  SIDEBAR_MENU_DEFAULT_ORDER.forEach((id) => {
    if (typeof menuVisibility[id] === 'boolean') {
      defaults[id] = menuVisibility[id];
    }
  });

  return defaults;
};

const getDefaultThemeSettings = () => ({
  backgroundColor: '#1A2B2E',
  surfaceColor: '#2A3B3E',
  textColor: '#FFFFFF',
  accentColor: '#00CED1',
  sidebarBackgroundColor: '#1A2B2E',
  sidebarBorderColor: '#2A3B3E',
  sidebarTextColor: '#FFFFFF',
  sidebarMutedTextColor: '#B0B0B0',
  sidebarItemBackgroundColor: '#2A3B3E',
  backgroundMode: 'solid',
  gradientAngle: 135,
  gradientColorOne: '#102128',
  gradientColorTwo: '#1A3943',
  gradientColorThree: '#245463',
  patternOpacity: 0.12,
  overlayColor: '#000000',
  overlayOpacity: 0.22,
  textureIntensity: 0.08,
  backgroundMotionSpeed: 24,
  motionEnabled: true,
  baseFontSize: 16,
  maxContentWidth: 1200
});

const getDefaultSidebarSettings = () => ({
  menuOrder: [...SIDEBAR_MENU_DEFAULT_ORDER],
  menuVisibility: buildDefaultSidebarVisibilityMap(),
  style: 'solid',
  expandedWidth: 280,
  collapsedWidth: 80,
  activeItemStyle: 'pill',
  hoverAnimation: 'lift',
  labelBehavior: 'hide-collapsed',
  showProfile: true,
  showQuickActions: true,
  itemRadius: 10,
  itemShadowStrength: 24,
  mobileMode: 'rail'
});

export const getDefaultSiteSettings = () => ({
  theme: getDefaultThemeSettings(),
  currency: {
    default: 'PKR',
    byPage: buildDefaultPageCurrencyMap()
  },
  sidebar: getDefaultSidebarSettings()
});

const sanitizeSettings = (rawSettings) => {
  const defaults = getDefaultSiteSettings();
  if (!rawSettings || typeof rawSettings !== 'object') {
    return defaults;
  }

  const theme = rawSettings.theme || {};
  const currency = rawSettings.currency || {};
  const sidebar = rawSettings.sidebar || {};

  const expandedWidth = sanitizeNumber(
    sidebar.expandedWidth,
    defaults.sidebar.expandedWidth,
    220,
    420
  );
  const collapsedWidth = sanitizeNumber(
    sidebar.collapsedWidth,
    defaults.sidebar.collapsedWidth,
    64,
    Math.max(64, expandedWidth - 40)
  );

  const sanitized = {
    theme: {
      backgroundColor: sanitizeColor(theme.backgroundColor, defaults.theme.backgroundColor),
      surfaceColor: sanitizeColor(theme.surfaceColor, defaults.theme.surfaceColor),
      textColor: sanitizeColor(theme.textColor, defaults.theme.textColor),
      accentColor: sanitizeColor(theme.accentColor, defaults.theme.accentColor),
      sidebarBackgroundColor: sanitizeColor(
        theme.sidebarBackgroundColor,
        defaults.theme.sidebarBackgroundColor
      ),
      sidebarBorderColor: sanitizeColor(theme.sidebarBorderColor, defaults.theme.sidebarBorderColor),
      sidebarTextColor: sanitizeColor(theme.sidebarTextColor, defaults.theme.sidebarTextColor),
      sidebarMutedTextColor: sanitizeColor(
        theme.sidebarMutedTextColor,
        defaults.theme.sidebarMutedTextColor
      ),
      sidebarItemBackgroundColor: sanitizeColor(
        theme.sidebarItemBackgroundColor,
        defaults.theme.sidebarItemBackgroundColor
      ),
      backgroundMode: sanitizeEnum(
        theme.backgroundMode,
        defaults.theme.backgroundMode,
        VALID_BACKGROUND_MODES
      ),
      gradientAngle: sanitizeNumber(theme.gradientAngle, defaults.theme.gradientAngle, 0, 360),
      gradientColorOne: sanitizeColor(theme.gradientColorOne, defaults.theme.gradientColorOne),
      gradientColorTwo: sanitizeColor(theme.gradientColorTwo, defaults.theme.gradientColorTwo),
      gradientColorThree: sanitizeColor(theme.gradientColorThree, defaults.theme.gradientColorThree),
      patternOpacity: sanitizeNumber(theme.patternOpacity, defaults.theme.patternOpacity, 0, 0.65),
      overlayColor: sanitizeColor(theme.overlayColor, defaults.theme.overlayColor),
      overlayOpacity: sanitizeNumber(theme.overlayOpacity, defaults.theme.overlayOpacity, 0, 0.7),
      textureIntensity: sanitizeNumber(
        theme.textureIntensity,
        defaults.theme.textureIntensity,
        0,
        0.3
      ),
      backgroundMotionSpeed: sanitizeNumber(
        theme.backgroundMotionSpeed,
        defaults.theme.backgroundMotionSpeed,
        8,
        90
      ),
      motionEnabled: sanitizeBoolean(theme.motionEnabled, defaults.theme.motionEnabled),
      baseFontSize: sanitizeNumber(theme.baseFontSize, defaults.theme.baseFontSize, 12, 24),
      maxContentWidth: sanitizeNumber(theme.maxContentWidth, defaults.theme.maxContentWidth, 800, 2200)
    },
    currency: {
      default: CURRENCY_CONFIG[currency.default] ? currency.default : defaults.currency.default,
      byPage: { ...defaults.currency.byPage }
    },
    sidebar: {
      menuOrder: normalizeSidebarMenuOrder(sidebar.menuOrder),
      menuVisibility: normalizeMenuVisibility(sidebar.menuVisibility),
      style: sanitizeEnum(sidebar.style, defaults.sidebar.style, VALID_SIDEBAR_STYLES),
      expandedWidth,
      collapsedWidth,
      activeItemStyle: sanitizeEnum(
        sidebar.activeItemStyle,
        defaults.sidebar.activeItemStyle,
        VALID_SIDEBAR_ACTIVE_STYLES
      ),
      hoverAnimation: sanitizeEnum(
        sidebar.hoverAnimation,
        defaults.sidebar.hoverAnimation,
        VALID_SIDEBAR_HOVER_STYLES
      ),
      labelBehavior: sanitizeEnum(
        sidebar.labelBehavior,
        defaults.sidebar.labelBehavior,
        VALID_SIDEBAR_LABEL_BEHAVIORS
      ),
      showProfile: sanitizeBoolean(sidebar.showProfile, defaults.sidebar.showProfile),
      showQuickActions: sanitizeBoolean(sidebar.showQuickActions, defaults.sidebar.showQuickActions),
      itemRadius: sanitizeNumber(sidebar.itemRadius, defaults.sidebar.itemRadius, 4, 24),
      itemShadowStrength: sanitizeNumber(
        sidebar.itemShadowStrength,
        defaults.sidebar.itemShadowStrength,
        0,
        70
      ),
      mobileMode: sanitizeEnum(
        sidebar.mobileMode,
        defaults.sidebar.mobileMode,
        VALID_SIDEBAR_MOBILE_MODES
      )
    }
  };

  const byPage = currency.byPage || {};
  SITE_PAGES.forEach((page) => {
    const pageCurrency = byPage[page.key];
    if (pageCurrency === 'default' || CURRENCY_CONFIG[pageCurrency]) {
      sanitized.currency.byPage[page.key] = pageCurrency;
    }
  });

  return sanitized;
};

const convertHexToRgb = (hexColor, fallback = '0,0,0') => {
  const color = sanitizeColor(hexColor, '');
  if (!color) {
    return fallback;
  }

  const raw = color.slice(1);
  const normalized = raw.length === 3 ? raw.split('').map((char) => `${char}${char}`).join('') : raw;
  const numberValue = Number.parseInt(normalized, 16);

  if (Number.isNaN(numberValue)) {
    return fallback;
  }

  const red = (numberValue >> 16) & 255;
  const green = (numberValue >> 8) & 255;
  const blue = numberValue & 255;

  return `${red},${green},${blue}`;
};

export const getSiteSettings = () => {
  if (typeof window === 'undefined') {
    return getDefaultSiteSettings();
  }

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return getDefaultSiteSettings();
    }
    const parsed = JSON.parse(raw);
    return sanitizeSettings(parsed);
  } catch (error) {
    console.error('Error loading site settings:', error);
    return getDefaultSiteSettings();
  }
};

export const saveSiteSettings = (settings) => {
  const sanitized = sanitizeSettings(settings);
  if (typeof window === 'undefined') {
    return sanitized;
  }

  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (error) {
    console.error('Error saving site settings:', error);
  }

  return sanitized;
};

export const applyThemeSettings = (settings) => {
  if (typeof document === 'undefined') {
    return;
  }

  const safeSettings = sanitizeSettings(settings);
  const root = document.documentElement;
  const overlayRgb = convertHexToRgb(safeSettings.theme.overlayColor, '0,0,0');
  const accentRgb = convertHexToRgb(safeSettings.theme.accentColor, '0,206,209');
  const sidebarShadowOpacity = clamp(safeSettings.sidebar.itemShadowStrength / 100, 0, 1);
  const floatingOffset = safeSettings.sidebar.style === 'floating' ? 36 : 0;

  root.style.setProperty('--site-bg-color', safeSettings.theme.backgroundColor);
  root.style.setProperty('--site-surface-color', safeSettings.theme.surfaceColor);
  root.style.setProperty('--site-text-color', safeSettings.theme.textColor);
  root.style.setProperty('--site-accent-color', safeSettings.theme.accentColor);
  root.style.setProperty('--site-accent-rgb', accentRgb);
  root.style.setProperty('--site-sidebar-bg-color', safeSettings.theme.sidebarBackgroundColor);
  root.style.setProperty('--site-sidebar-border-color', safeSettings.theme.sidebarBorderColor);
  root.style.setProperty('--site-sidebar-text-color', safeSettings.theme.sidebarTextColor);
  root.style.setProperty('--site-sidebar-muted-text-color', safeSettings.theme.sidebarMutedTextColor);
  root.style.setProperty('--site-sidebar-item-bg-color', safeSettings.theme.sidebarItemBackgroundColor);
  root.style.setProperty('--site-base-font-size', `${safeSettings.theme.baseFontSize}px`);
  root.style.setProperty('--site-max-content-width', `${safeSettings.theme.maxContentWidth}px`);
  root.style.setProperty('--site-bg-gradient-angle', `${safeSettings.theme.gradientAngle}deg`);
  root.style.setProperty('--site-bg-gradient-color-one', safeSettings.theme.gradientColorOne);
  root.style.setProperty('--site-bg-gradient-color-two', safeSettings.theme.gradientColorTwo);
  root.style.setProperty('--site-bg-gradient-color-three', safeSettings.theme.gradientColorThree);
  root.style.setProperty('--site-bg-pattern-opacity', `${safeSettings.theme.patternOpacity}`);
  root.style.setProperty('--site-bg-overlay-opacity', `${safeSettings.theme.overlayOpacity}`);
  root.style.setProperty('--site-bg-overlay-rgb', overlayRgb);
  root.style.setProperty('--site-bg-texture-intensity', `${safeSettings.theme.textureIntensity}`);
  root.style.setProperty('--site-bg-motion-duration', `${safeSettings.theme.backgroundMotionSpeed}s`);
  root.style.setProperty('--site-sidebar-expanded-width', `${safeSettings.sidebar.expandedWidth}px`);
  root.style.setProperty('--site-sidebar-collapsed-width', `${safeSettings.sidebar.collapsedWidth}px`);
  root.style.setProperty('--site-main-content-offset', `${safeSettings.sidebar.expandedWidth + floatingOffset}px`);
  root.style.setProperty(
    '--site-main-content-offset-collapsed',
    `${safeSettings.sidebar.collapsedWidth + floatingOffset}px`
  );
  root.style.setProperty('--site-sidebar-item-radius', `${safeSettings.sidebar.itemRadius}px`);
  root.style.setProperty('--site-sidebar-shadow-opacity', `${sidebarShadowOpacity}`);
};

export const getCurrencyForPage = (pageKey = 'default') => {
  const settings = getSiteSettings();
  const pageCurrency = settings.currency.byPage?.[pageKey];
  const currencyCode =
    pageCurrency && pageCurrency !== 'default' ? pageCurrency : settings.currency.default;

  return CURRENCY_CONFIG[currencyCode] ? currencyCode : 'PKR';
};

export const getSidebarMenuOrder = () => {
  const settings = getSiteSettings();
  const order = settings.sidebar?.menuOrder;

  if (!Array.isArray(order) || order.length === 0) {
    return [...SIDEBAR_MENU_DEFAULT_ORDER];
  }

  return order;
};

export const getSidebarMenuVisibility = () => {
  const settings = getSiteSettings();
  return normalizeMenuVisibility(settings.sidebar?.menuVisibility);
};

export const getThemePresetByKey = (presetKey) => {
  if (!presetKey || !THEME_PRESETS[presetKey]) {
    return null;
  }
  return THEME_PRESETS[presetKey];
};
