import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ShipperHereMap from "../../../components/ShipperHereMap";

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [distanceInfo, setDistanceInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shipperNotFound, setShipperNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setShipperNotFound(false);

    axios
      .get("http://localhost:8080/api/v1/users/moderators-with-orders")
      .then((res) => {
        const shippers = res.data;
        const shipper = shippers.find((s) =>
          s.orderIds.includes(Number(orderId))
        );
        if (!shipper) {
          setShipperNotFound(true);
          setLoading(false);
          return null; // Dừng chain axios
        }
        return axios.get(
          `http://localhost:8080/api/v1/location/user/${shipper.userId}/order/${orderId}`
        );
      })
      .then((res) => {
        if (res) {
          setDistanceInfo(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Lỗi khi tải dữ liệu");
        setLoading(false);
      });
  }, [orderId]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Nút quay lại */}
      <button
        onClick={() => navigate("/admin/shipper")}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 20,
          padding: "8px 14px",
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        ← Quay lại
      </button>

      {/* Alert thông báo shipper không tìm thấy */}
      {shipperNotFound && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#fdecea",
            color: "#b71c1c",
            border: "1px solid #f44336",
            padding: "10px 20px",
            borderRadius: 8,
            zIndex: 50,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            maxWidth: 400,
            textAlign: "center",
          }}
        >
          Không tìm thấy shipper cho đơn hàng #{orderId}.
        </div>
      )}

      {/* Alert lỗi chung */}
      {error && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#fdecea",
            color: "#b71c1c",
            border: "1px solid #f44336",
            padding: "10px 20px",
            borderRadius: 8,
            zIndex: 50,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            maxWidth: 400,
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {loading && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#e3f2fd",
            color: "#1565c0",
            border: "1px solid #90caf9",
            padding: "10px 20px",
            borderRadius: 8,
            zIndex: 50,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            maxWidth: 400,
            textAlign: "center",
          }}
        >
          Đang tải dữ liệu...
        </div>
      )}

      {distanceInfo && !loading && !shipperNotFound && (
        <>
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: "10px 14px",
              borderRadius: 8,
              zIndex: 1,
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            <p style={{ margin: 0 }}>
              📏 Khoảng cách:{" "}
              <strong>{(distanceInfo.distance / 1000).toFixed(2)} km</strong>
            </p>
          </div>

          <ShipperHereMap
            userLocation={distanceInfo.userLocation}
            shippingLocation={distanceInfo.shippingLocation}
          />
        </>
      )}
    </div>
  );
};

export default OrderTrackingPage;
