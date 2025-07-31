import axiosInstance from "../utils/axiosInstance";
// src/services/contactService.jsx
import axios from "axios";

export const sendContactForm = async (formData) => {
  const res = await axiosInstance.post("/user", formData);
  return res.data;
};
