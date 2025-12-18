import axios from "axios";

// re-usable instance
const BACKEND_URL = import.meta.env.VITE_NODE_ENV === 'production' ? import.meta.env.VITE_BACKEND_URL : "http://localhost:5050/wt";
const axiosInstance = axios.create({
  baseURL: BACKEND_URL, //  Backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // using cookies
});

export default axiosInstance;
