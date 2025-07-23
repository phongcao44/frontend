import { Typography, Button, Space } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import ProductCard from "./ProductCard";
import { useEffect, useState, useRef } from "react";
import { loadProductsPaginate } from "../../../redux/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";

const { Title, Text } = Typography;

const ExploreProducts = () => {
  const dispatch = useDispatch();
 const scrollContainerRef = useRef(null);
  const paginatedProducts = useSelector((state) => state.products.paginated);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const params = {
      page,
      limit: 20,
    };
    dispatch(loadProductsPaginate(params));
  }, [dispatch, page]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300, // Adjust scroll distance as needed
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300, // Adjust scroll distance as needed
        behavior: "smooth",
      });
    }
  };

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
          <Button shape="circle" icon={<LeftOutlined />} onClick={scrollLeft} />
          <Button shape="circle" icon={<RightOutlined />} onClick={scrollRight} />
        </Space>
      </div>

      <div
        ref={scrollContainerRef}
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "24px",
          paddingBottom: "16px",
          scrollBehavior: "smooth",
          scrollbarWidth: "none", /* For Firefox */
          "-ms-overflow-style": "none", /* For IE and Edge */
        }}
      >
        {paginatedProducts?.data?.content?.map((product) => (
          <div key={product.id} style={{ flex: "0 0 auto", width: "250px" }}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 32 }}>
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