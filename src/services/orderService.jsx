import axiosInstance from "../utils/axiosInstance";

export const fetchPaginatedOrders = async ({
  page = 0,
  limit = 10,
  sortBy = "createdAt",
  orderBy = "desc",
  status = "",
  keyword = "",
  userId = "",
  cancellationReason = ""
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
        userId,
        cancellationReason
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
    const response = await axiosInstance.put(`admin/order/edit/${id}`, {
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

export const getMyOrders = async (status = null) => {
  try {
    const response = await axiosInstance.get("/user/order/list", {
      params: { status },
    });
    return response.data;
  } catch (error) {
    console.error("getMyOrders error:", error);
    throw error.response?.data || "Có lỗi xảy ra khi tải danh sách đơn hàng";
  }
};

export const getOrderDetail = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/user/order/detail/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("getOrderDetail error:", error);
    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy đơn hàng");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền xem đơn hàng này");
    }
    throw error.response?.data || "Có lỗi xảy ra khi tải chi tiết đơn hàng";
  }
};

export const cancelOrder = async (orderId, { cancellationReason, customCancellationReason }) => {
  try {
    const response = await axiosInstance.put(`/user/order/cancel/${orderId}`, {
      cancellationReason,
      customCancellationReason,
    });
    return response.data;
  } catch (error) {
    console.error("cancelOrder error:", error);
    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy đơn hàng");
    }
    if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền hủy đơn hàng này");
    }
    if (error.response?.status === 400) {
      throw new Error(
        error.response?.data?.message || "Lý do hủy đơn hàng không hợp lệ"
      );
    }
    throw error.response?.data || "Có lỗi xảy ra khi hủy đơn hàng";
  }
};


