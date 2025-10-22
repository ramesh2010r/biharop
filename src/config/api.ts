// API Configuration
// In production, use relative paths to go through Nginx proxy
// In development, use the backend server directly
export const API_URL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative paths in production (Nginx proxy)
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001');

// Helper function to get API URL
export const getApiUrl = (path: string = ''): string => {
  const baseUrl = API_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

