import { authHeader } from './auth';
import { apiBaseUrl } from './config';
export const apiRequest = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...authHeader(),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${apiBaseUrl}api${url}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};