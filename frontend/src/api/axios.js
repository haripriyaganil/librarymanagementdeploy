import axios from "axios";

const api = axios.create({
  baseURL: "https://librarymanagementdeploy.onrender.com/api",
});

export default api;