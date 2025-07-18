import axiosInstance from "../utils/axiosInstance";

export const fetchPaginatedOrders = async ({
  page = 0,
  limit = 10,
  sortBy = "createdAt",
  orderBy = "desc",
  status = "",
  keyword = "",
}) => {
  try {
    const response = await axiosInstance.get("/admin/order/paginate", {
      params: {
        page,
        limit,
        sortBy,
        orderBy,
        status,
        keyword,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchOrders = async () => {
  try {
    const response = await axiosInstance.get("/admin/order/list");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await axiosInstance.put(`.admin/order/edit/${id}`, {
      status,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteOrder = async (id) => {
  try {
    const response = await axiosInstance.delete(`/order/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchOrderDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/order/detail/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
