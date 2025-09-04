export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const authHeader = () => {
  const token = getAuthToken();
  
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

export const logout = () => {
  localStorage.removeItem('authToken');
  // Redirect to login page with full page reload to clear all state
  window.location.href = '/login';
};