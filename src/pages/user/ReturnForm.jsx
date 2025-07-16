import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { submitReturnRequest } from "../../services/returnProduct";

const ReturnForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state; // { orderId, productId, productName, thumbnail }

  const [reason, setReason] = useState("");
  const [media, setMedia] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item) return;

    const formData = new FormData();
    formData.append("orderId", item.orderId);
    formData.append("itemId", item.itemId);
    formData.append("reason", reason);
    formData.append("media", media);

    console.log("Submitting return request:",formData)
for (let pair of formData.entries()) {
  console.log(`${pair[0]}:`, pair[1]);
}

    try {
      setSubmitting(true);
      await submitReturnRequest(formData);
      alert("Gửi yêu cầu đổi/trả thành công!");
      navigate("/delivered-products");
    } catch (err) {
      alert("Lỗi gửi yêu cầu: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (!item) {
    return <p className="text-center mt-8 text-red-600">Không có thông tin sản phẩm để đổi/trả.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4 border rounded-xl shadow-sm mt-6">
      <h2 className="text-xl font-semibold">Yêu cầu đổi/trả sản phẩm</h2>

      <div className="flex items-center gap-4">
        <img src={item.mediaUrl} alt={item.productName} className="w-20 h-20 rounded object-cover" />
        <div>
          <p className="font-medium">{item.productName}</p>
          <p className="text-sm text-gray-500">Đơn hàng #{item.orderId}</p>
        </div>
      </div>

      <textarea
        placeholder="Lý do đổi/trả"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
        className="border p-2 w-full rounded"
      />

      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setMedia(e.target.files[0])}
        required
        className="block"
      />

      <button
        type="submit"
        disabled={submitting}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
      </button>
    </form>
  );
};

export default ReturnForm;
