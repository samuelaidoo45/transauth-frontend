import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "https://7ed1-172-166-151-112.ngrok-free.app", // Replace with your base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors if needed (e.g., for authentication)
api.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookies(); // Function to get the token from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to retrieve token from cookies
function getTokenFromCookies(): string | null {
  const matches = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return matches ? decodeURIComponent(matches[1]) : null;
}

export default api;
