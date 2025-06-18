import { useState } from "react";
import { Layout, Row, Col, Typography, Input, Button, Space } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import qr from "../../assets/images/qr.png";

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <AntFooter
      style={{
        backgroundColor: "#000",
        color: "#fff",
        padding: "40px 0",
        fontSize: "14px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <Row gutter={[16, 16]} justify="start" wrap>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Title
              level={4}
              style={{
                color: "#fff",
                marginBottom: 12,
                fontSize: "18px",
              }}
            >
              Exclusive
            </Title>
            <Text
              style={{
                color: "#ccc",
                display: "block",
                marginBottom: 8,
              }}
            >
              Subscribe
            </Text>
            <Text
              style={{
                color: "#aaa",
                display: "block",
                marginBottom: 12,
              }}
            >
              Get 10% off your first order
            </Text>
            <form onSubmit={handleSubscribe}>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  maxWidth: 250,
                  border: "2px solid #fff",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    background: "#000",
                    color: "#ccc",
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                  }}
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: "#000",
                    color: "#fff",
                    border: "none",
                    padding: "0 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
              </div>
            </form>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <Title
              level={5}
              style={{
                color: "#fff",
                marginBottom: 12,
                fontSize: "16px",
              }}
            >
              Support
            </Title>
            <Text
              style={{
                color: "#ccc",
                display: "block",
                marginBottom: 8,
              }}
            >
              111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.
            </Text>
            <Text
              style={{
                color: "#ccc",
                display: "block",
                marginBottom: 8,
              }}
            >
              exclusive@gmail.com
            </Text>
            <Text style={{ color: "#ccc", display: "block" }}>
              +88015-88888-9999
            </Text>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <Title
              level={5}
              style={{
                color: "#fff",
                marginBottom: 12,
                fontSize: "16px",
              }}
            >
              Account
            </Title>
            <Space direction="vertical" size={4}>
              <Link href="#" style={{ color: "#ccc", fontSize: "14px" }}>
                My Account
              </Link>
              <Link href="#" style={{ color: "#ccc", fontSize: "14px" }}>
                Login / Register
              </Link>
              <Link href="#" style={{ color: "#ccc", fontSize: "14px" }}>
                Cart
              </Link>
              <Link href="#" style={{ color: "#ccc", fontSize: "14px" }}>
                Wishlist
              </Link>
              <Link href="#" style={{ color: "#ccc", fontSize: "14px" }}>
                Shop
              </Link>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <Title
              level={5}
              style={{
                color: "#fff",
                marginBottom: 12,
                fontSize: "16px",
              }}
            >
              Quick Link
            </Title>
            <Space direction="vertical" size={4}>
              <Link href="#" style={{ color: "#ccc", fontSize: "14px" }}>
                Privacy Policy
              </Link>
              <Link href="#" style={{ color: "#ccc", fontSize: "14px" }}>
                Terms Of Use
              </Link>
              <Link href="#" style={{ color: "#ccc", fontSize: "14px" }}>
                FAQ
              </Link>
              <Link href="#" style={{ color: "#ccc", fontSize: "14px" }}>
                Contact
              </Link>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Title
              level={5}
              style={{
                color: "#fff",
                marginBottom: 12,
                fontSize: "16px",
              }}
            >
              Download App
            </Title>
            <Text
              style={{
                color: "#aaa",
                display: "block",
                marginBottom: 12,
              }}
            >
              Save $3 with App New User Only
            </Text>
            <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
              <Col xs={8} sm={6} md={8}>
                <img
                  src={qr}
                  alt="QR Code"
                  style={{
                    width: "100%",
                    backgroundColor: "#fff",
                    padding: 4,
                    borderRadius: 4,
                  }}
                />
              </Col>
              <Col xs={16} sm={18} md={16}>
                <Space direction="vertical" style={{ width: "100%" }} size={6}>
                  <Button
                    block
                    style={{
                      background: "#000",
                      border: "1px solid #fff",
                      color: "#fff",
                      fontSize: "12px",
                      padding: "4px 8px",
                      whiteSpace: "normal",
                    }}
                  >
                    Get it on Google Play
                  </Button>
                  <Button
                    block
                    style={{
                      background: "#000",
                      border: "1px solid #fff",
                      color: "#fff",
                      fontSize: "12px",
                      padding: "4px 8px",
                      whiteSpace: "normal",
                    }}
                  >
                    App Store
                  </Button>
                </Space>
              </Col>
            </Row>
            <Space size="small">
              <a href="#">
                <FacebookOutlined style={{ fontSize: 16, color: "#fff" }} />
              </a>
              <a href="#">
                <TwitterOutlined style={{ fontSize: 16, color: "#fff" }} />
              </a>
              <a href="#">
                <InstagramOutlined style={{ fontSize: 16, color: "#fff" }} />
              </a>
              <a href="#">
                <LinkedinOutlined style={{ fontSize: 16, color: "#fff" }} />
              </a>
            </Space>
          </Col>
        </Row>

        <div
          style={{
            textAlign: "center",
            color: "#666",
            marginTop: 16,
            fontSize: "12px",
          }}
        >
          <Text>© Copyright Rimel 2022. All rights reserved.</Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
