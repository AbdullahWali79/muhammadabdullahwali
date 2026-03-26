export const formatCurrencyToRupees = (value, fallback = 'N/A') => {
  if (value === null || value === undefined) {
    return fallback;
  }

  const raw = String(value).trim();
  if (!raw) {
    return fallback;
  }

  let normalized = raw
    .replace(/\bUSD\b/gi, 'Rs')
    .replace(/\bdollars?\b/gi, 'Rs')
    .replace(/\$/g, 'Rs ')
    .replace(/\bPKR\b/gi, 'Rs')
    .replace(/\bRS\.?\b/gi, 'Rs')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (!/^Rs\b/i.test(normalized) && /^\d/.test(normalized)) {
    normalized = `Rs ${normalized}`;
  }

  return normalized.replace(/^Rs\.?\s*/i, 'Rs ').trim();
};
