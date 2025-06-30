import axiosInstance from "../utils/axiosInstance";

export const fetchAllSizes = async () => {
  const response = await axiosInstance.get("/size/list");
  return response.data;
};

export const addSize = async (sizeData) => {
  const response = await axiosInstance.post("/size/add", sizeData);
  return response.data;
};

export const updateSize = async (sizeId, updatedData) => {
  const response = await axiosInstance.put(`/size/edit/${sizeId}`, updatedData);
  return response.data;
};

export const deleteSize = async (sizeId) => {
  const response = await axiosInstance.delete(`/size/delete/${sizeId}`);
  return response.data;
};
