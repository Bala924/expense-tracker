import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      return Promise.reject(error);
    } else if (error.request) {
      // No response received
      return Promise.reject({
        response: {
          data: {
            message:
              'Unable to connect to server. Please make sure Spring Boot is running.',
          },
          status: 503,
        },
      });
    }

    return Promise.reject(error);
  }
);

export default api;