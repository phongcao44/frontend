import React, { useEffect, useState } from "react";
import { getDeliveredProducts } from "../../services/returnProduct";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

const DeliveredProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getDeliveredProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => alert("Failed to load data: " + err.message))
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
    <div className="w-full px-4 py-6 flex justify-center bg-gray-50 min-h-screen">
      <div className="w-full max-w-[1200px]">
        <h1 className="text-2xl font-semibold mb-6">Sản phẩm đã giao</h1>

        <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200 bg-white">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-left font-semibold text-gray-600">
              <tr>
                {/* <th className="px-4 py-3">NGÀY TẠO</th> */}
                <th className="px-4 py-3">SẢN PHẨM</th>
                <th className="px-4 py-3">HÌNH ẢNH/VIDEO</th>
                <th className="px-4 py-3">TRẠNG THÁI</th>
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
                  {/* <td className="px-4 py-3">
                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                  </td> */}
                  
                  <td className="px-4 py-3">{item.productName}</td>

                  <td className="px-4 py-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-green-400 to-teal-400 text-white flex items-center justify-center text-sm">
                      👤
                    </div>
                    {item.customerName || "Bạn"}
                  </td>

                  <td className="px-4 py-3">
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
                  </td>
                  <td className="px-4 py-3">
                    {Number(item.price || 0).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    {/* <button
                      onClick={() => navigate(`/order/${item.orderId}`)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Xem chi tiết đơn"
                    >
                      <Eye className="w-5 h-5" />
                    </button> */}
                    <button
                      onClick={() =>
                        navigate("/return-form", {
                          state: {
                            orderId: item.orderId,
                            itemId: item.itemId,
                            productName: item.productName,
                            mediaUrl: item.mediaUrl, // đảm bảo backend trả về đúng
                          },
                        })
                      }
                      className="text-red-600 hover:text-red-800 transition text-sm underline"
                    >
                      Trả hàng
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveredProductsPage;
