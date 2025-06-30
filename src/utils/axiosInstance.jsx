import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token");
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBzaG9wLnZuIiwiaWF0IjoxNzUwODY1Njc1LCJleHAiOjE3NTA4NjY1Mzl9.Pi-nM2d3OdK8Q4ntCZPKlQ6xtO7Nza_8_x-IO7HPVEU";
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
