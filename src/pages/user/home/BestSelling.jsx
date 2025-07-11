import { Row, Col, Typography, Button, Spin } from "antd";
import ProductCard from "./ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadTopBestSellingProducts } from "../../../redux/slices/productSlice";

const { Text, Title } = Typography;

const BestSelling = () => {
  const dispatch = useDispatch();
  const { topBestSelling, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(loadTopBestSellingProducts());
  }, [dispatch]);

  console.log(topBestSelling);

  return (
    <div
      style={{
        marginBottom: 48,
        padding: "40px 20px",
        backgroundColor: "#fff",
      }}
    >
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
          This Month
        </Text>
      </div>

      {/* Title and Action */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Best Selling Products
        </Title>
        <Button
          type="primary"
          danger
          size="large"
          style={{
            backgroundColor: "#db4444",
            height: 48,
            padding: "0 32px",
            fontSize: 16,
            fontWeight: 600,
            borderRadius: 5,
          }}
        >
          View All
        </Button>
      </div>

      {/* Product List */}
      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          {topBestSelling.length > 0 ? (
            topBestSelling.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))
          ) : (
            <Col span={24}>
              <Text>No best selling products available.</Text>
            </Col>
          )}
        </Row>
      )}
    </div>
  );
};

export default BestSelling;
