import React, { useEffect, useState } from "react";
import { getDeliveredProducts } from "../../services/returnProduct";
import { useNavigate } from "react-router-dom";

const DeliveredProductSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getDeliveredProducts()
            .then((res) => setProducts(res.data))
            .catch((err) => alert("Không thể tải sản phẩm đã giao: " + err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <span className="text-gray-500 text-base">Đang tải đơn hàng...</span>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h1 className="text-2xl font-semibold mb-6">Sản phẩm đã giao</h1>
            <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200 bg-white">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-gray-50 text-left font-semibold text-gray-600">
                        <tr>
                            <th className="px-4 py-3">SẢN PHẨM</th>
                            <th className="px-4 py-3">HÌNH ẢNH/VIDEO</th>
                            {/* <th className="px-4 py-3">TRẠNG THÁI</th> */}
                            <th className="px-4 py-3">GIÁ TIỀN</th>
                            <th className="px-4 py-3">HÀNH ĐỘNG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((item) => (
                            <tr
                                key={item.itemId}
                                className="border-t border-gray-200 hover:bg-gray-50 transition"
                            >
                                <td className="px-4 py-3">{item.productName}</td>
                                <td className="px-4 py-3">
                                    <img
                                        src={item.mediaUrl}
                                        alt={item.productName}
                                        className="w-12 h-12 object-cover rounded-md border"
                                    />
                                </td>

                                {/* <td className="px-4 py-3">
                                    <span
                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${item.deliveryStatus === "DELIVERED"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        📦{" "}
                                        {item.deliveryStatus === "DELIVERED"
                                            ? "Đã giao hàng"
                                            : "Chờ xử lý"}
                                    </span>
                                </td> */}
                                <td className="px-4 py-3">
                                    {Number(item.price || 0).toLocaleString("vi-VN")}
                                </td>
<td className="px-4 py-3">
  {item.alreadyRequested ? (
    <span className="text-gray-400 italic text-sm">Đã gửi yêu cầu</span>
  ) : (
    <button
      onClick={() =>
        navigate("/return-form", {
          state: {
            orderId: item.orderId,
            itemId: item.itemId,
            productName: item.productName,
            mediaUrl: item.mediaUrl,
          },
        })
      }
      className="text-red-600 hover:text-red-800 transition text-sm underline"
    >
      Trả hàng
    </button>
  )}
</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DeliveredProductSection;
