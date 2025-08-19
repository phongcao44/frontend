import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { submitReturnRequest } from "../../services/returnProduct";
import Swal from "sweetalert2";

const ReturnForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state; // { orderId, productId, productName, thumbnail }

  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [media, setMedia] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const previewUrl = useMemo(() => (media ? URL.createObjectURL(media) : null), [media]);

  const commonReasons = [
    "Hàng lỗi/đã hỏng khi nhận",
    "Sai mẫu/sai màu/sai kích thước",
    "Thiếu phụ kiện/thiếu hàng",
    "Hàng giả/không đúng mô tả",
    "Khác",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item) return;
    if (!reason.trim() || !media) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng chọn lý do và tải lên hình ảnh/video minh chứng.",
        timer: 2500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      return;
    }

    const formData = new FormData();
    formData.append("orderId", item.orderId);
    formData.append("itemId", item.itemId);
    formData.append("reason", details ? `${reason} - ${details}` : reason);
    formData.append("media", media);

    try {
      setSubmitting(true);
      await submitReturnRequest(formData);
      await Swal.fire({
        icon: "success",
        title: "Đã gửi yêu cầu",
        text: "Yêu cầu đổi/trả của bạn đã được gửi thành công.",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      navigate("/user/returns");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gửi yêu cầu thất bại",
        text: err.response?.data?.message || err.message || "Vui lòng thử lại sau",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-xl p-8 text-center">
          <p className="text-red-600 font-medium">Không có thông tin sản phẩm để đổi/trả.</p>
          <button
            onClick={() => navigate("/user/deliveredProduct")}
            className="mt-4 px-5 py-2 rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Quay về sản phẩm đã giao
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-2xl">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Yêu cầu đổi/trả sản phẩm</h2>
          <p className="text-gray-600 mt-1">Vui lòng cung cấp lý do và minh chứng để chúng tôi hỗ trợ nhanh nhất.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <img src={item.mediaUrl} alt={item.productName} className="w-20 h-20 rounded-xl object-cover border" />
            <div>
              <p className="font-medium text-gray-900">{item.productName}</p>
              <p className="text-sm text-gray-500">Đơn hàng #{item.orderId}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lý do</label>
              <select
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              >
                <option value="" disabled>Chọn lý do</option>
                {commonReasons.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chi tiết bổ sung (không bắt buộc)</label>
              <input
                type="text"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Mô tả thêm về vấn đề..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh/Video minh chứng</label>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <label className="flex-1 cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition">
                <div className="text-center text-gray-600">
                  <p className="font-medium">Kéo thả hoặc bấm để tải lên</p>
                  <p className="text-sm text-gray-500 mt-1">Hỗ trợ hình ảnh hoặc video</p>
                </div>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setMedia(e.target.files[0] || null)}
                  className="hidden"
                  required
                />
              </label>
              {previewUrl && (
                <div className="w-full md:w-40">
                  {media?.type?.startsWith("video/") ? (
                    <video src={previewUrl} controls className="w-full h-28 object-cover rounded-xl border" />
                  ) : (
                    <img src={previewUrl} alt="preview" className="w-full h-28 object-cover rounded-xl border" />
                  )}
                  <button
                    type="button"
                    onClick={() => setMedia(null)}
                    className="mt-2 w-full px-3 py-2 text-sm rounded-xl border text-gray-700 hover:bg-gray-50"
                  >
                    Xóa tệp
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 px-6 py-3 text-white rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                submitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang gửi...
                </>
              ) : (
                "Gửi yêu cầu"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnForm;
