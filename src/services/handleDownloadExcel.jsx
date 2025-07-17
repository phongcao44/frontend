import axiosInstance from "../utils/axiosInstance";

export const handleDownloadExcel = async () => {
  try {
    const response = await axiosInstance.get("/admin/order/excel", {
      responseType: "blob", // để nhận file Excel dạng nhị phân
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("❌ Lỗi khi tải Excel:", error);
    alert("Tải file thất bại!");
  }
};
