import { Row, Col, Button, Typography, Space } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import ProductCard from "./ProductCard";
import FlashCountdown from "./FlashCountdown";
import { products } from "./data";

const { Title, Text } = Typography;

const FlashSale = () => {
  return (
    <div style={{ padding: "40px 20px", backgroundColor: "#fff" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Section Header Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "40px",
              backgroundColor: "#ff4d4f",
              borderRadius: "4px",
              marginRight: "16px",
            }}
          />
          <Text
            style={{ color: "#ff4d4f", fontSize: "16px", fontWeight: "600" }}
          >
            {"Today's"}
          </Text>
        </div>

        {/* Flash Sale Title and Countdown + Arrows */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              flexWrap: "wrap",
              gap: "40px",
            }}
          >
            <Title
              level={2}
              style={{ margin: 0, fontSize: "36px", fontWeight: "600" }}
            >
              Flash Sales
            </Title>
            <FlashCountdown />
          </div>

          <Space>
            <Button
              type="default"
              shape="circle"
              icon={<LeftOutlined />}
              size="middle"
            />
            <Button
              type="default"
              shape="circle"
              icon={<RightOutlined />}
              size="middle"
            />
          </Space>
        </div>

        {/* Product Cards */}
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <ProductCard product={product} showDiscountLabel />
            </Col>
          ))}
        </Row>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Button
            type="primary"
            size="large"
            style={{
              backgroundColor: "#ff4d4f",
              borderColor: "#ff4d4f",
              padding: "12px 48px",
              height: "auto",
              borderRadius: "4px",
            }}
          >
            View All Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlashSale;
