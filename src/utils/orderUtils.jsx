export const getStatusColor = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800";
    case "SHIPPED":
      return "bg-cyan-100 text-cyan-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "RETURNED":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const translateStatus = (status) => {
  switch (status) {
    case "PENDING":
      return "Chờ xử lý";
    case "CONFIRMED":
      return "Đã xác nhận";
    case "SHIPPED":
      return "Đã gửi hàng";
    case "DELIVERED":
      return "Đã giao hàng";
    case "CANCELLED":
      return "Đã hủy";
    case "RETURNED":
      return "Đã trả hàng";
    default:
      return "Không rõ";
  }
};
