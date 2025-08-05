// Helper function to save auth data to localStorage with expiration
export const saveAuthToStorage = (userData, accessToken) => {
  const authData = {
    user: userData,
    accessToken: accessToken,
    expiresAt: new Date().getTime() + (8 * 60 * 60 * 1000), // 8 hours from now
  };
  localStorage.setItem('authData', JSON.stringify(authData));
};

// Helper function to get auth data from localStorage
export const getAuthFromStorage = () => {
  const authData = localStorage.getItem('authData');
  if (!authData) return null;
  
  const parsed = JSON.parse(authData);
  const now = new Date().getTime();
  
  // Check if data has expired
  if (now > parsed.expiresAt) {
    localStorage.removeItem('authData');
    return null;
  }
  
  return parsed;
};

// Helper function to clear auth data from localStorage
export const clearAuthFromStorage = () => {
  localStorage.removeItem('authData');
};

// Helper function to check if user is logged in from localStorage
export const checkAuthFromStorage = () => {
  const authData = localStorage.getItem('authData');
  if (!authData) return false;
  
  const parsed = JSON.parse(authData);
  const now = new Date().getTime();
  
  // Check if data has expired
  if (now > parsed.expiresAt) {
    localStorage.removeItem('authData');
    return false;
  }
  
  return true;
}; 