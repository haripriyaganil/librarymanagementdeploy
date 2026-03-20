import axios from 'axios';

const api = axios.create({
  baseURL: 'https://librarymanagementdeploy.onrender.com/api', // Change to your backend URL
  withCredentials: true, // If you use cookies/auth
});

export default api;
