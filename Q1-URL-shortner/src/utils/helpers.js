export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const generateShortCode = () => {
  return Math.random().toString(36).substr(2, 6);
};