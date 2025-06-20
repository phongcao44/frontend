import axios from "axios";
const BASE_URL = "http://localhost:3000";

export const fetchFlashSales = () => {
  return axios.get(`${BASE_URL}/flash-sales`);
};
