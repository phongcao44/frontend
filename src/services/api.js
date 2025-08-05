// services/api.js
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// Gắn token từ Cookies vào tất cả request
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token"); // đúng với nơi bạn lưu token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("Không tìm thấy access token trong Cookies");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
