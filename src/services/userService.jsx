import axiosInstance from "../utils/axiosInstance";

export const addUser = async (userData) => {
  const response = await axiosInstance.post("/admin/users/add", userData);
  return response.data;
};

export const fetchUsers = async () => {
  const response = await axiosInstance.get("/admin/users");
  return response.data;
};

export const changeUserRole = async (userId, roleId) => {
  const response = await axiosInstance.patch(
    `/admin/users/${userId}/changeRole/${roleId}`
  );
  return response.data;
};

export const deleteUserRole = async (userId, roleId) => {
  const response = await axiosInstance.delete(
    `/admin/users/${userId}/deleteRole/${roleId}`
  );
  return response.data;
};

export const changeUserStatus = async (userId, status) => {
  const response = await axiosInstance.patch(`/admin/users/${userId}/status`, {
    status,
  });
  return response.data;
};
