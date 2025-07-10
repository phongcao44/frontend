import { Card, Row, Col, Typography, Button, Space } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

// eslint-disable-next-line react/prop-types
const CategorySection = ({ categories = [] }) => {
  return (
    <div style={{ padding: "40px 20px", backgroundColor: "#fff" }}>
      <div style={{ marginBottom: 48 }}>
        {/* Section Header Label */}
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
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
            Categories
          </Text>
        </div>

        {/* Title */}
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
            Browse By Category
          </Title>
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

        {/* Category Items */}
        <Row gutter={[16, 16]}>
          {categories.map((category, index) => (
            <Col xs={12} sm={8} md={6} lg={4} key={index}>
              <Card
                hoverable
                variant="outlined"
                style={{
                  textAlign: "center",
                  height: 120,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: category.active ? "#db4444" : "#ffffff",
                  borderColor: category.active ? "#db4444" : "#f0f0f0",
                  transition: "all 0.3s",
                }}
                styles={{
                  body: {
                    padding: 16,
                  },
                }}
              >
                <div
                  style={{
                    fontSize: 32,
                    marginBottom: 8,
                    color: category.active ? "#ffffff" : "#8c8c8c",
                  }}
                >
                  {category.icon}
                </div>
                <Text
                  style={{
                    color: category.active ? "#ffffff" : "#000000",
                    fontWeight: 500,
                  }}
                >
                  {category.name}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default CategorySection;
