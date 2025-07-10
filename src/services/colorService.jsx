import axiosInstance from "../utils/axiosInstance";

export const fetchColors = async () => {
  const response = await axiosInstance.get("/list");
  return response.data;
};

export const addColor = async (colorData) => {
  const response = await axiosInstance.post("/color/add", colorData);
  return response.data;
};

export const autoAddColor = async (colorData) => {
  const response = await axiosInstance.post("/color/autoadd", colorData);
  return response.data;
};

export const updateColor = async (id, colorData) => {
  const response = await axiosInstance.put(`/color/edit/${id}`, colorData);
  return response.data;
};

export const deleteColor = async (id) => {
  const response = await axiosInstance.delete(`/color/delete/${id}`);
  return response.data;
};
