import ShipperHereMap from "../../../components/ShipperHereMap";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderTrackingPage = () => {
  const [distanceInfo, setDistanceInfo] = useState(null);
  const { orderId } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/location/user/2/order/${orderId}`)
      .then((res) => setDistanceInfo(res.data))
      .catch((err) => console.error(err));
  }, [orderId]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Nút quay lại */}
      <button
        onClick={() => navigate("/admin/shipper")}
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          zIndex: 2,
          padding: "8px 14px",
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ← Quay lại
      </button>

      {distanceInfo && (
        <>
          {/* Hiển thị khoảng cách */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: "10px 14px",
              borderRadius: "8px",
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
