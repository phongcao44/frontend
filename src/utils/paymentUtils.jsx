
export const getPaymentColor = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "FAILED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const translatePaymentStatus = (status) => {
  if (!status) return "Không rõ";
  switch (status) {
    case "PENDING":
      return "Chờ thanh toán";
    case "COMPLETED":
      return "Đã thanh toán";
    case "FAILED":
      return "Thanh toán thất bại";
    default:
      return "Không rõ";
  }
};

export const translatePaymentMethod = (method) => {
  if (!method) return "Không rõ";
  switch (method) {
    case "COD":
      return "Thanh toán khi nhận hàng";
    case "BANK_TRANSFER":
      return "Chuyển khoản ngân hàng";
    case "PAYPAL":
      return "PayPal";
    case "CREDIT_CARD":
      return "Thẻ tín dụng";
    default:
      return "Không rõ";
  }
};
