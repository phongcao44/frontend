import axiosInstance from "../utils/axiosInstance";

const API = "/admin/return-request";
const USER_API = "/user/my-requests";

export const fetchAllReturnRequests = async () => {
  const response = await axiosInstance.get(`${API}/list`);
  return response.data;
};

export const fetchReturnRequestById = async (id) => {
  const response = await axiosInstance.get(`${API}/${id}`);
  return response.data;
};

export const updateReturnRequestStatus = async (id, status) => {
  const response = await axiosInstance.put(`${API}/update/${id}`, { status });
  return response.data;
};

// Fetch user's own return requests
export const fetchUserReturnRequests = async () => {
  const response = await axiosInstance.get(`${USER_API}/list`);
  return response.data;
};
