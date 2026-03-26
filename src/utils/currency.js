import { CURRENCY_CONFIG, getCurrencyForPage } from './siteSettings';

const CURRENCY_TOKEN_REGEX = /\b(?:PKR|USD|EUR|GBP|US\$|dollars?)\b|Rs\.?|[$€£]/gi;

const prefixWithSymbol = (symbol, value, spaceAfterSymbol) =>
  `${symbol}${spaceAfterSymbol ? ' ' : ''}${value}`.replace(/\s{2,}/g, ' ').trim();

export const formatCurrencyByCode = (value, currencyCode = 'PKR', fallback = 'N/A') => {
  if (value === null || value === undefined) {
    return fallback;
  }

  const raw = String(value).trim();
  if (!raw) {
    return fallback;
  }

  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.PKR;
  const hasDigits = /\d/.test(raw);
  if (!hasDigits) {
    return raw;
  }

  let cleaned = raw.replace(CURRENCY_TOKEN_REGEX, '').replace(/\s{2,}/g, ' ').trim();
  if (!cleaned) {
    cleaned = '0';
  }

  return prefixWithSymbol(config.symbol, cleaned, config.spaceAfterSymbol);
};

export const formatCurrency = (value, pageKey = 'default', fallback = 'N/A') => {
  const currencyCode = getCurrencyForPage(pageKey);
  return formatCurrencyByCode(value, currencyCode, fallback);
};

export const formatCurrencyToRupees = (value, fallback = 'N/A') =>
  formatCurrencyByCode(value, 'PKR', fallback);
