import React, { useEffect, useState } from "react";
import { getDeliveredProducts } from "../../services/returnProduct";
import { useNavigate } from "react-router-dom";

const DeliveredProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [processingItems, setProcessingItems] = useState([]); // List of items being processed
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getDeliveredProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => alert("Failed to load data: " + err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleReturn = (item) => {
    setProcessingItems((prev) => [...prev, item.itemId]);
    navigate("/return-form", { state: item });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-gray-500 text-base">Loading delivered products...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Delivered Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((item) => (
          <div
            key={item.itemId}
            className="flex gap-4 p-4 border rounded-xl shadow-sm bg-white items-center"
          >
            <img
              src={item.mediaUrl}
              alt={item.productName}
              className="w-24 h-24 object-cover rounded border"
            />

            <div className="flex-1">
              <p className="font-semibold text-base">{item.productName}</p>
              {item.variantInfo && (
                <p className="text-sm text-gray-500">{item.variantInfo}</p>
              )}
              <p className="text-sm text-gray-700">Quantity: {item.quantity}</p>

              {/* <p className="text-sm text-gray-700">Order ID: #{item.orderId}</p> */}
              {/* <p className="text-sm text-gray-700">Price: {item.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "VND",
              })}</p> */}
            </div>

            <button
              disabled={processingItems.includes(item.itemId)}
              onClick={() => handleReturn(item)}
              className={`px-4 py-2 rounded font-medium text-sm transition duration-200 ${processingItems.includes(item.itemId)
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              {processingItems.includes(item.itemId)
                ? "Processing..."
                : "Return"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveredProductsPage;
