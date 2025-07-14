import React, { useState ,useEffect} from "react";
import { submitReturnRequest } from "../../services/returnProduct";
import { getDeliveredOrders } from "../../services/returnProduct";

const ReturnForm = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [reason, setReason] = useState("");
  const [media, setMedia] = useState(null);

  useEffect(() => {
    getDeliveredOrders().then((res) => setOrders(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitReturnRequest({
        orderId: selectedOrderId,
        reason,
        media,
      });
      alert("Gửi yêu cầu thành công!");
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Yêu cầu đổi/trả</h2>

      <select
        value={selectedOrderId}
        onChange={(e) => setSelectedOrderId(e.target.value)}
        required
        className="border p-2"
      >
        <option value="">-- Chọn đơn hàng đã giao --</option>
        {orders.map((order) => (
          <option key={order.id} value={order.id}>
            #{order.id} - {new Date(order.createdAt).toLocaleDateString()}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Lý do đổi/trả"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
        className="border p-2 w-full"
      />

      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setMedia(e.target.files[0])}
        required
      />

      <button type="submit" className="bg-black text-white px-4 py-2">
        Gửi yêu cầu
      </button>
    </form>
  );
};

export default ReturnForm;