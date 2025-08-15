import axiosInstance from "../utils/axiosInstance";
// src/services/contactService.jsx
import axios from "axios";

export const sendContactForm = async (formData) => {
  const res = await axiosInstance.post("/user", formData);
  return res.data;
};

// Admin: fetch all contacts
export const getAdminContacts = async () => {
  const res = await axiosInstance.get("/admin/contacts");
  return res.data;
};

// Admin: delete a contact by id (uses query param id)
export const deleteAdminContact = async (id) => {
  const res = await axiosInstance.delete(`/admin/${id}`);
  return res.data;
};
