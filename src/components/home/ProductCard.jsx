import PropTypes from "prop-types";
import { Card, Button, Typography, Rate } from "antd";
import { HeartOutlined, EyeOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ProductCard = ({ product, showDiscountLabel = false }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  if (!product) return null;

  const {
    id,
    name,
    images,
    price,
    originalPrice,
    discount,
    averageRating,
    totalReviews,
  } = product;

  const image =
    images?.find((img) => img.is_main)?.image_url ||
    images?.[0]?.image_url ||
    "/placeholder.png";

  const salePrice = price;
  const rating = averageRating || 0;
  const reviews = totalReviews || 0;

  const handleNavigate = () => {
    navigate(`/product/${id}`);
  };

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
          body: {
            padding: "16px",
          },
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

            {/* Discount */}
            {showDiscountLabel && discount && (
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
                -{discount}%
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
                onClick={(e) => {
                  e.stopPropagation();
                }}
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
            {discount ? (
              <>
                <Text
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#ff4d4f",
                  }}
                >
                  ${salePrice}
                </Text>
                <Text delete style={{ fontSize: "14px", color: "#999" }}>
                  ${originalPrice}
                </Text>
              </>
            ) : (
              <Text
                style={{ fontSize: "16px", fontWeight: "600", color: "#000" }}
              >
                ${originalPrice || salePrice}
              </Text>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Rate disabled defaultValue={rating} style={{ fontSize: "12px" }} />
            <Text style={{ fontSize: "12px", color: "#999" }}>({reviews})</Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        image_url: PropTypes.string.isRequired,
        is_main: PropTypes.bool,
      })
    ).isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    discount: PropTypes.number,
    averageRating: PropTypes.number,
    totalReviews: PropTypes.number,
  }),
  showDiscountLabel: PropTypes.bool,
};

export default ProductCard;
