import axiosInstance from "../utils/axiosInstance";

export const handleDownloadPDF = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/order/pdf/${orderId}`, {
      responseType: "blob",
    });

    // Tạo file blob từ dữ liệu PDF
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Tạo URL tải về
    const url = window.URL.createObjectURL(blob);

    // Tạo thẻ <a> ẩn để tải file
    const link = document.createElement("a");
    link.href = url;
    link.download = `order_${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();

    // Dọn dẹp
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("❌ Lỗi khi tải PDF:", error);
    alert("Tải file PDF thất bại!");
  }
};
