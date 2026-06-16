export const safeParseJSON = (rawValue, fallback = null, label = 'JSON value') => {
  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    console.error(`Error parsing ${label}:`, error);
    return fallback;
  }
};
