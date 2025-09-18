import axios from "axios";

// re-usable instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, //  Backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // using cookies
});

export default axiosInstance;
