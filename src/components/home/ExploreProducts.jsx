import { Typography, Button, Space, Row, Col } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import ProductCard from "./ProductCard";

const { Title, Text } = Typography;

// eslint-disable-next-line react/prop-types
const ExploreProducts = ({ allProducts = [] }) => {
  return (
    <div>
      {/* Section Header Label */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
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
          Our Products
        </Text>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Explore Our Products
        </Title>
        <Space>
          <Button shape="circle" icon={<LeftOutlined />} />
          <Button shape="circle" icon={<RightOutlined />} />
        </Space>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {allProducts.map((product) => (
          <Col xs={24} sm={12} md={6} key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          danger
          size="large"
          style={{
            backgroundColor: "#db4444",
            height: 48,
            paddingLeft: 32,
            paddingRight: 32,
          }}
        >
          View All Products
        </Button>
      </div>
    </div>
  );
};

export default ExploreProducts;
