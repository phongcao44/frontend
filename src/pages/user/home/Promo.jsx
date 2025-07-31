import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Typography, Button } from "antd";
import { fetchTop1FlashSale } from "../../../redux/slices/flashSaleSlice";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Promo = () => {
  const dispatch = useDispatch();
  const { top1FlashSale, loading } = useSelector((state) => state.flashSale);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    dispatch(fetchTop1FlashSale());
  }, [dispatch]);


  const navigate = useNavigate();

  const handleBuyNow = () => {
    console.log("Navigating to product:", top1FlashSale.productId);
    navigate(`/product/${top1FlashSale.productId}`);
    
  };

  // Countdown setup
  useEffect(() => {
    if (!top1FlashSale?.endTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(top1FlashSale.endTime);
      const diff = Math.max(end - now, 0);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown({ days, hours, minutes, seconds });

      if (diff <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [top1FlashSale?.endTime]);

  if (loading || !top1FlashSale) return null;

  return (
    <div
      style={{
        background: "#000000",
        borderRadius: 8,
        padding: "60px 48px",
        marginBottom: 48,
        color: "white",
        position: "relative",
        overflow: "hidden",
        minHeight: 300,
      }}
    >
      <Row align="middle" gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <div style={{ marginBottom: 16 }}>
            <Text style={{ color: "#00ff88", fontSize: 16, fontWeight: 600 }}>
              🔥 {top1FlashSale.flashSaleName}
            </Text>
          </div>

          <Title level={1} style={{ color: "white", marginBottom: 16, fontSize: 38 }}>
            {top1FlashSale.productName}
          </Title>

          <Text style={{ fontSize: 16, color: "#ccc", display: "block", marginBottom: 16 }}>
            {top1FlashSale.productDescription}
          </Text>

          {/* Countdown */}
          {countdown && (
            <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Ngày", value: countdown.days },
                { label: "Giờ", value: countdown.hours },
                { label: "Phút", value: countdown.minutes },
                { label: "Giây", value: countdown.seconds },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "white",
                    color: "black",
                    borderRadius: "50%",
                    width: 60,
                    height: 60,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  <div style={{ fontSize: 18 }}>{item.value.toString().padStart(2, '0')}</div>
                  <div>{item.label}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: "#00ff88", marginRight: 16 }}>
              {top1FlashSale.discountedPrice.toLocaleString()}₫
            </span>
            <span style={{ fontSize: 18, color: "#aaa", textDecoration: "line-through" }}>
              {top1FlashSale.price.toLocaleString()}₫
            </span>
          </div>

          <Button
            type="primary"
            size="large"
            onClick={handleBuyNow}
            style={{
              backgroundColor: "#00ff88",
              borderColor: "#00ff88",
              color: "black",
              fontWeight: 600,
              height: 56,
              padding: "0 48px",
              fontSize: 16,
              borderRadius: 4,
            }}
          >
            Mua ngay
          </Button>

        </Col>

        <Col xs={24} md={12}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <img
              src={top1FlashSale.imageUrl}
              alt={top1FlashSale.productName}
              style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Promo;
