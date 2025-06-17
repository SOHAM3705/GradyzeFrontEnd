import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token expired or user logged in elsewhere
      sessionStorage.clear(); // Clear all storage
      const currentPath = window.location.pathname;

      // Decide where to redirect based on path
      if (currentPath.includes('admindash') || currentPath.includes('admin')) {
        window.location.href = '/adminlogin';
      } else if (currentPath.includes('teacherdash') || currentPath.includes('teacher')) {
        window.location.href = '/teacherlogin';
      } else if (currentPath.includes('studentdash') || currentPath.includes('student')) {
        window.location.href = '/studentlogin';
      } else {
        window.location.href = '/'; // fallback
      }
    }
    return Promise.reject(error);
  }
);

export default api;
