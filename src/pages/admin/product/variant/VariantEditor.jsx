/* eslint-disable react/prop-types */
import { Card, List, Tag, Typography, Space, Empty } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const VariantEditor = ({ variants = [], productId }) => {
  const navigate = useNavigate();

  return (
    <Card
      style={{
        marginTop: 24,
        marginBottom: 24,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
      bodyStyle={{ padding: 24 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Space align="center">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "#722ed1",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            {variants.length}
          </div>
          <Title
            level={4}
            style={{
              margin: 0,
              cursor: "pointer",
              color: "#1a1a1a",
              transition: "color 0.2s",
            }}
            onClick={() => navigate(`/admin/products/${productId}/variant`)}
            onMouseEnter={(e) => (e.target.style.color = "#722ed1")}
            onMouseLeave={(e) => (e.target.style.color = "#1a1a1a")}
          >
            Biến thể
          </Title>
        </Space>
      </div>

      {variants.length === 0 ? (
        <Empty
          description="Chưa có biến thể nào cho sản phẩm này"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          dataSource={variants}
          renderItem={(variant, idx) => (
            <List.Item
              key={variant.id || idx}
              onClick={() => navigate(`/admin/products/${productId}/variant`)}
              style={{
                padding: "12px 0",
                borderBottom: "1px solid #f0f0f0",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fafafa")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Space>
                  {variant.colorName && (
                    <Tag color="blue" style={{ fontSize: 14, padding: "4px 8px" }}>
                      Màu sắc: {variant.colorName}
                    </Tag>
                  )}
                  {variant.sizeName && (
                    <Tag color="purple" style={{ fontSize: 14, padding: "4px 8px" }}>
                      Kích thước: {variant.sizeName}
                    </Tag>
                  )}
                </Space>
                <Space>
                  <Tag color="green" style={{ fontSize: 14, padding: "4px 8px" }}>
                    Số lượng: {variant.stockQuantity || 0}
                  </Tag>
                  <Text strong style={{ fontSize: 14, color: "#722ed1" }}>
                    {variant.priceOverride?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }) || "Chưa đặt giá"}
                  </Text>
                </Space>
              </Space>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default VariantEditor;