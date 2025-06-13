import axios from "axios";

// re-usable instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/wt", //  Backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // using cookies
});

export default axiosInstance;
