import axiosInstance from "../utils/axiosInstance";

export const getDashboardStats = async () => {
  const response = await axiosInstance.get("/admin/revenue/dashboard");
  return response.data;
};

export const getRevenueByYear = async (year) => {
  const response = await axiosInstance.get(`/admin/revenue/year?year=${year}`);
  return response.data;
};

export const getRevenueByMonth = async (month, year) => {
  const response = await axiosInstance.get(`/admin/revenue/month?month=${month}&year=${year}`);
  return response.data;
};
