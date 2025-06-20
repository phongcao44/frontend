import PropTypes from "prop-types";
import { Card, Button, Typography, Rate } from "antd";
import { HeartOutlined, EyeOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ProductCard = ({ product, showDiscountLabel = false }) => {
  if (!product) return null;

  const { name, image, salePrice, originalPrice, discount, rating, reviews } =
    product;

  return (
    <div style={{ padding: "0 8px" }}>
      <Card
        hoverable
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

            {showDiscountLabel && (
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
            <Text
              style={{ fontSize: "16px", fontWeight: "600", color: "#ff4d4f" }}
            >
              ${salePrice || 0}
            </Text>
            <Text delete style={{ fontSize: "14px", color: "#999" }}>
              ${originalPrice}
            </Text>
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
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    salePrice: PropTypes.number,
    originalPrice: PropTypes.number,
    discount: PropTypes.number,
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.number.isRequired,
  }),
  showDiscountLabel: PropTypes.bool,
};

export default ProductCard;
