import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Rate,
  Divider,
  Typography,
  Space,
  Breadcrumb,
  Image,
  InputNumber,
} from "antd";
import {
  HeartOutlined,
  TruckOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadProductDetail } from "../redux/slices/productSlice";
import ProductCard from "../components/home/ProductCard";

const { Title, Text, Paragraph } = Typography;

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [quantity, setQuantity] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [wishlist, setWishlist] = useState({});

  const dispatch = useDispatch();
  const { id: productId } = useParams();
  const product = useSelector((state) => state.products.productDetail);

  useEffect(() => {
    if (productId) {
      dispatch(loadProductDetail(productId));
    }
  }, [dispatch, productId]);

  if (!product) return <div>Loading...</div>;

  const allVariants = product.variants;

  const colors = Array.from(
    new Map(product.variants.map((v) => [v.color.id, v.color])).values()
  );
  const sizes = Array.from(
    new Map(product.variants.map((v) => [v.size.id, v.size])).values()
  );

  const availableSizes = sizes
    .filter((size) =>
      allVariants.some(
        (v) =>
          v.size.id === size.id &&
          (selectedColor ? v.color.id === selectedColor : true) &&
          v.stock_quantity > 0
      )
    )
    .map((s) => s.id);

  const availableColors = colors
    .filter((color) =>
      allVariants.some(
        (v) =>
          v.color.id === color.id &&
          (selectedSize ? v.size.id === selectedSize : true) &&
          v.stock_quantity > 0
      )
    )
    .map((c) => c.id);

  const matchedVariant = allVariants.find(
    (v) => v.color.id === selectedColor && v.size.id === selectedSize
  );

  const fallbackPrice = product.price ?? product.originalPrice ?? 0;
  const finalPrice = matchedVariant?.price_override ?? fallbackPrice;

  const hasDiscount =
    matchedVariant &&
    matchedVariant.price_override !== null &&
    matchedVariant.price_override < product.originalPrice;

  // eslint-disable-next-line no-unused-vars
  const toggleWishlist = (id) => {
    setWishlist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleColorClick = (id) => {
    setSelectedColor((prev) => (prev === id ? null : id));
    setSelectedSize((prevSize) =>
      allVariants.some(
        (v) =>
          v.color.id === id && v.size.id === prevSize && v.stock_quantity > 0
      )
        ? prevSize
        : null
    );
  };

  const handleSizeClick = (id) => {
    setSelectedSize((prev) => (prev === id ? null : id));
    setSelectedColor((prevColor) =>
      allVariants.some(
        (v) =>
          v.size.id === id && v.color.id === prevColor && v.stock_quantity > 0
      )
        ? prevColor
        : null
    );
  };

  const relatedProducts = [];

  return (
    <div style={{ minHeight: "100vh", padding: "20px 0" }}>
      <div className="container">
        <Breadcrumb
          style={{ marginBottom: 24 }}
          items={[
            { title: "Account" },
            { title: "Category" },
            { title: product.name },
          ]}
        />

        <Row
          gutter={[32, 32]}
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "8px",
          }}
        >
          <Col lg={15} md={12} sm={24}>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {product.images.map((image, index) => (
                    <div
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      style={{
                        cursor: "pointer",
                        border:
                          selectedImage === index
                            ? "2px solid #ff4d4f"
                            : "1px solid #e0e0e0",
                        borderRadius: "8px",
                        padding: "4px",
                        backgroundColor: "#f8f9fa",
                        boxShadow:
                          selectedImage === index
                            ? "0 2px 8px rgba(255, 77, 79, 0.2)"
                            : "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Image
                        src={image.image_url}
                        alt={`${product.name} ${index + 1}`}
                        width="100%"
                        height={80}
                        style={{ objectFit: "cover", borderRadius: "4px" }}
                        preview={false}
                      />
                    </div>
                  ))}
                </div>
              </Col>

              <Col span={18}>
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "400px",
                  }}
                >
                  <Image
                    src={product.images[selectedImage]?.image_url}
                    alt={product.name}
                    width="100%"
                    height="100%"
                    style={{
                      objectFit: "contain",
                      borderRadius: "8px",
                      maxHeight: "400px",
                    }}
                    preview={{ src: product.images[selectedImage]?.image_url }}
                  />
                </div>
              </Col>
            </Row>
          </Col>

          <Col lg={9} md={12} sm={24}>
            <div>
              <Title level={2} style={{ marginBottom: 16 }}>
                {product.name}
              </Title>
              <div className="d-flex align-items-center mb-3">
                <Rate disabled defaultValue={product.averageRating} />
                <Text style={{ marginLeft: 8, color: "#999" }}>
                  ({product.totalReviews} Reviews)
                </Text>
                <Divider type="vertical" />
                <Text style={{ color: "#52c41a" }}>In Stock</Text>
              </div>

              {typeof finalPrice === "number" &&
                (hasDiscount ? (
                  <div style={{ marginBottom: 24 }}>
                    <Text
                      delete
                      style={{ fontSize: 18, color: "#999", marginRight: 12 }}
                    >
                      ${product.originalPrice?.toFixed(2)}
                    </Text>
                    <Title
                      level={3}
                      style={{ color: "#ff4d4f", display: "inline-block" }}
                    >
                      ${finalPrice.toFixed(2)}
                    </Title>
                  </div>
                ) : (
                  <Title
                    level={3}
                    style={{ color: "#ff4d4f", marginBottom: 24 }}
                  >
                    ${finalPrice.toFixed(2)}
                  </Title>
                ))}

              <Paragraph
                style={{ marginBottom: 24, color: "#666", lineHeight: 1.6 }}
              >
                {product.description}
              </Paragraph>

              <Divider />

              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                  Colours:
                </Text>
                <Space>
                  {colors.map((color) => {
                    const disabled = !availableColors.includes(color.id);
                    return (
                      <div
                        key={color.id}
                        onClick={() => !disabled && handleColorClick(color.id)}
                        style={{
                          width: 20,
                          height: 20,
                          backgroundColor: color.hex_code,
                          border:
                            selectedColor === color.id
                              ? "3px solid #ff4d4f"
                              : "2px solid #d9d9d9",
                          borderRadius: "50%",
                          cursor: disabled ? "not-allowed" : "pointer",
                          opacity: disabled ? 0.4 : 1,
                        }}
                      />
                    );
                  })}
                </Space>
              </div>

              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                  Size:
                </Text>
                <Space>
                  {sizes.map((size) => {
                    const disabled = !availableSizes.includes(size.id);
                    return (
                      <Button
                        key={size.id}
                        size="small"
                        type={selectedSize === size.id ? "primary" : "default"}
                        onClick={() => !disabled && handleSizeClick(size.id)}
                        disabled={disabled}
                        style={{
                          minWidth: 32,
                          height: 32,
                          backgroundColor:
                            selectedSize === size.id
                              ? "#ff4d4f"
                              : "transparent",
                          borderColor:
                            selectedSize === size.id ? "#ff4d4f" : "#d9d9d9",
                          color: disabled ? "#999" : undefined,
                          opacity: disabled ? 0.5 : 1,
                        }}
                      >
                        {size.name}
                      </Button>
                    );
                  })}
                </Space>
              </div>

              <div className="d-flex align-items-center gap-3 mb-4">
                <InputNumber
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={setQuantity}
                  style={{ width: 80 }}
                />
                <Button
                  type="primary"
                  size="large"
                  style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
                >
                  Buy Now
                </Button>
                <Button
                  size="large"
                  icon={<HeartOutlined />}
                  style={{ border: "1px solid #d9d9d9" }}
                />
              </div>

              <div
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: "8px",
                  padding: "16px",
                }}
              >
                <div className="d-flex align-items-center mb-3">
                  <TruckOutlined style={{ fontSize: 20, marginRight: 12 }} />
                  <div>
                    <Text strong>Free Delivery</Text>
                    <br />
                    <Text style={{ fontSize: "12px", color: "#666" }}>
                      Enter your postal code for Delivery Availability
                    </Text>
                  </div>
                </div>
                <Divider style={{ margin: "12px 0" }} />
                <div className="d-flex align-items-center">
                  <ReloadOutlined style={{ fontSize: 20, marginRight: 12 }} />
                  <div>
                    <Text strong>Return Delivery</Text>
                    <br />
                    <Text style={{ fontSize: "12px", color: "#666" }}>
                      Free 30 Days Delivery Returns. Details
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <div style={{ marginTop: 48 }}>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 30 }}
          >
            <div
              style={{
                width: 20,
                height: 40,
                backgroundColor: "#ff4d4f",
                borderRadius: 4,
                marginRight: 16,
              }}
            />
            <Text
              style={{
                color: "#ff4d4f",
                fontSize: 16,
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              Related Item
            </Text>
          </div>

          <Row gutter={[24, 24]}>
            {relatedProducts.map((product) => (
              <Col key={product.id} lg={6} md={8} sm={12} xs={24}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
