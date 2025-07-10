/* eslint-disable no-unused-vars */
// 🗂️ Đúng imports
import PropTypes from "prop-types";
import { Card, Button, Typography, Rate, message } from "antd";
import { HeartOutlined, EyeOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../../redux/slices/cartSlice";
import { loadVariantsByProduct } from "../../../redux/slices/productVariantSlice";

const { Title, Text } = Typography;

const ProductCard = ({ product, showDiscountLabel = false }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!product) return null;

  const {
    id,
    name,
    images,
    price,
    originalPrice,
    discountPercentage,
    discountAmount,
    discountType,
    averageRating,
    totalReviews,
  } = product;

  const image =
    images?.find((img) => img.is_main)?.image_url ||
    images?.[0]?.image_url ||
    "/placeholder.png";

  const handleNavigate = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    const res = await dispatch(loadVariantsByProduct(product.id)).unwrap();
    const variantId = res?.[0]?.id;

    if (!variantId) {
      message.error("Không tìm thấy variant!");
      return;
    }

    dispatch(addItemToCart({ variantId, quantity: 1 }))
      .unwrap()
      .then(() => {
        message.success("Đã thêm vào giỏ hàng!");
      })
      .catch(() => {
        message.error("Thêm giỏ hàng thất bại!");
      });
  };

  // 👉 Xác định nhãn giảm giá
  const discountLabel = discountPercentage
    ? `-${discountPercentage}%`
    : discountAmount
    ? `- ${discountAmount.toLocaleString()}đ`
    : null;

  return (
    <div
      style={{ padding: "0 8px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card
        hoverable
        onClick={handleNavigate}
        style={{
          borderRadius: "4px",
          overflow: "hidden",
          position: "relative",
        }}
        styles={{
          body: { padding: "16px" },
        }}
        cover={
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingTop: "100%",
            }}
          >
            <img
              src={image}
              alt={name}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {showDiscountLabel && discountLabel && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  backgroundColor: "red",
                  color: "white",
                  padding: "2px 8px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  borderRadius: "2px",
                }}
              >
                {discountLabel}
              </div>
            )}

            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                type="text"
                icon={<HeartOutlined />}
                size="small"
                style={{
                  backgroundColor: "white",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
              <Button
                type="text"
                icon={<EyeOutlined />}
                size="small"
                style={{
                  backgroundColor: "white",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </div>

            {hovered && (
              <Button
                type="primary"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                  right: "10px",
                  backgroundColor: "#000",
                  borderColor: "#000",
                  color: "#fff",
                  fontWeight: 600,
                  height: "40px",
                  fontSize: "14px",
                }}
                onClick={handleAddToCart}
              >
                Add To Cart
              </Button>
            )}
          </div>
        }
      >
        <div style={{ minHeight: "120px" }}>
          <Title level={5} style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
            {name}
          </Title>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            {discountLabel ? (
              <>
                <Text
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#ff4d4f",
                  }}
                >
                  {price.toLocaleString("vi-VN")} VNĐ
                </Text>
                <Text delete style={{ fontSize: "14px", color: "#999" }}>
                  {originalPrice?.toLocaleString("vi-VN")} VNĐ
                </Text>
              </>
            ) : (
              <Text
                style={{ fontSize: "16px", fontWeight: "600", color: "#000" }}
              >
                {price.toLocaleString("vi-VN")} VNĐ
              </Text>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Rate
              disabled
              defaultValue={averageRating || 0}
              style={{ fontSize: "12px" }}
            />
            <Text style={{ fontSize: "12px", color: "#999" }}>
              ({totalReviews || 0})
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        image_url: PropTypes.string.isRequired,
        is_main: PropTypes.bool,
      })
    ).isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    discountPercentage: PropTypes.number,
    discountAmount: PropTypes.number,
    discountType: PropTypes.string,
    averageRating: PropTypes.number,
    totalReviews: PropTypes.number,
  }),
  showDiscountLabel: PropTypes.bool,
};

export default ProductCard;
