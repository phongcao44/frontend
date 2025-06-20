import { Row, Col, Typography } from "antd";
import {
  TruckOutlined,
  CustomerServiceOutlined,
  SafetyOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const ServicesSection = () => {
  const services = [
    {
      icon: <TruckOutlined style={{ fontSize: "32px", color: "#fff" }} />,
      title: "FREE AND FAST DELIVERY",
      description: "Free delivery for all orders over $140",
    },
    {
      icon: (
        <CustomerServiceOutlined style={{ fontSize: "32px", color: "#fff" }} />
      ),
      title: "24/7 CUSTOMER SERVICE",
      description: "Friendly 24/7 customer support",
    },
    {
      icon: <SafetyOutlined style={{ fontSize: "32px", color: "#fff" }} />,
      title: "MONEY BACK GUARANTEE",
      description: "We return money within 30 days",
    },
  ];

  return (
    <Row gutter={[32, 32]} className="mt-5 pt-5">
      {services.map((service, index) => (
        <Col xs={24} md={8} key={index} className="text-center">
          <div className="d-flex flex-column align-items-center">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mb-3"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#333",
                border: "8px solid #666",
              }}
            >
              {service.icon}
            </div>
            <Title level={4} className="mb-2" style={{ fontWeight: "bold" }}>
              {service.title}
            </Title>
            <Text style={{ color: "#666", fontSize: "14px" }}>
              {service.description}
            </Text>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default ServicesSection;
