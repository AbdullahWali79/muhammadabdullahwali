const SETTINGS_STORAGE_KEY = 'siteSettings.v1';

export const CURRENCY_CONFIG = {
  PKR: { code: 'PKR', label: 'Rupee (Rs)', symbol: 'Rs', spaceAfterSymbol: true },
  USD: { code: 'USD', label: 'Dollar ($)', symbol: '$', spaceAfterSymbol: false },
  EUR: { code: 'EUR', label: 'Euro (€)', symbol: '€', spaceAfterSymbol: false },
  GBP: { code: 'GBP', label: 'Pound (£)', symbol: '£', spaceAfterSymbol: false }
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

const buildDefaultPageCurrencyMap = () =>
  SITE_PAGES.reduce((acc, page) => {
    acc[page.key] = 'default';
    return acc;
  }, {});

export const getDefaultSiteSettings = () => ({
  theme: {
    backgroundColor: '#1A2B2E',
    surfaceColor: '#2A3B3E',
    textColor: '#FFFFFF',
    accentColor: '#00CED1',
    sidebarBackgroundColor: '#1A2B2E',
    sidebarBorderColor: '#2A3B3E',
    sidebarTextColor: '#FFFFFF',
    sidebarMutedTextColor: '#B0B0B0',
    sidebarItemBackgroundColor: '#2A3B3E',
    baseFontSize: 16,
    maxContentWidth: 1200
  },
  currency: {
    default: 'PKR',
    byPage: buildDefaultPageCurrencyMap()
  }
});

const sanitizeSettings = (rawSettings) => {
  const defaults = getDefaultSiteSettings();
  if (!rawSettings || typeof rawSettings !== 'object') {
    return defaults;
  }

  const theme = rawSettings.theme || {};
  const currency = rawSettings.currency || {};

  const sanitized = {
    theme: {
      backgroundColor: theme.backgroundColor || defaults.theme.backgroundColor,
      surfaceColor: theme.surfaceColor || defaults.theme.surfaceColor,
      textColor: theme.textColor || defaults.theme.textColor,
      accentColor: theme.accentColor || defaults.theme.accentColor,
      sidebarBackgroundColor: theme.sidebarBackgroundColor || defaults.theme.sidebarBackgroundColor,
      sidebarBorderColor: theme.sidebarBorderColor || defaults.theme.sidebarBorderColor,
      sidebarTextColor: theme.sidebarTextColor || defaults.theme.sidebarTextColor,
      sidebarMutedTextColor: theme.sidebarMutedTextColor || defaults.theme.sidebarMutedTextColor,
      sidebarItemBackgroundColor: theme.sidebarItemBackgroundColor || defaults.theme.sidebarItemBackgroundColor,
      baseFontSize: Number.isFinite(Number(theme.baseFontSize))
        ? Number(theme.baseFontSize)
        : defaults.theme.baseFontSize,
      maxContentWidth: Number.isFinite(Number(theme.maxContentWidth))
        ? Number(theme.maxContentWidth)
        : defaults.theme.maxContentWidth
    },
    currency: {
      default: CURRENCY_CONFIG[currency.default] ? currency.default : defaults.currency.default,
      byPage: { ...defaults.currency.byPage }
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

  root.style.setProperty('--site-bg-color', safeSettings.theme.backgroundColor);
  root.style.setProperty('--site-surface-color', safeSettings.theme.surfaceColor);
  root.style.setProperty('--site-text-color', safeSettings.theme.textColor);
  root.style.setProperty('--site-accent-color', safeSettings.theme.accentColor);
  root.style.setProperty('--site-sidebar-bg-color', safeSettings.theme.sidebarBackgroundColor);
  root.style.setProperty('--site-sidebar-border-color', safeSettings.theme.sidebarBorderColor);
  root.style.setProperty('--site-sidebar-text-color', safeSettings.theme.sidebarTextColor);
  root.style.setProperty('--site-sidebar-muted-text-color', safeSettings.theme.sidebarMutedTextColor);
  root.style.setProperty('--site-sidebar-item-bg-color', safeSettings.theme.sidebarItemBackgroundColor);
  root.style.setProperty('--site-base-font-size', `${safeSettings.theme.baseFontSize}px`);
  root.style.setProperty('--site-max-content-width', `${safeSettings.theme.maxContentWidth}px`);
};

export const getCurrencyForPage = (pageKey = 'default') => {
  const settings = getSiteSettings();
  const pageCurrency = settings.currency.byPage?.[pageKey];
  const currencyCode =
    pageCurrency && pageCurrency !== 'default'
      ? pageCurrency
      : settings.currency.default;

  return CURRENCY_CONFIG[currencyCode] ? currencyCode : 'PKR';
};
