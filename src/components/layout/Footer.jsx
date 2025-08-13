import { memo, useState } from "react";
import { Row, Col, Input, Button, Space } from "antd";
import { Link } from "react-router-dom";

import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import qr from "../../assets/images/qr.png"; // Changed to WebP

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <footer className="bg-black text-white py-10 px-4 sm:px-5">
      <div className="max-w-screen-xl mx-auto">
        <Row gutter={[16, 16]} justify="start">
          <Col xs={24} sm={12} md={8} lg={6}>
            <h4 className="text-white text-lg font-semibold mb-3">Exclusive</h4>
            <p className="text-gray-400 mb-2">Subscribe</p>
            <p className="text-gray-500 mb-3">Get 10% off your first order</p>
            <form onSubmit={handleSubscribe} className="flex max-w-[250px]">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-black text-gray-400 border-2 border-white rounded-l-md focus:border-white"
                style={{ borderRight: "none" }}
              />
              <Button
                type="primary"
                htmlType="submit"
                className="bg-black border-2 border-white rounded-r-md border-l-0 p-0 min-w-[44px] h-[40px] flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faPaperPlane} className="text-white" />
              </Button>
            </form>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <h5 className="text-white text-base font-semibold mb-3">Support</h5>
            <p className="text-gray-400 mb-2">
              111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.
            </p>
            <p className="text-gray-400 mb-2">exclusive@gmail.com</p>
            <p className="text-gray-400">+88015-88888-9999</p>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <h5 className="text-white text-base font-semibold mb-3">Account</h5>
            <Space direction="vertical" size={4}>
              {[
                { label: "My Account", to: "/user" },
                { label: "Login / Register", to: "/signup" },
                { label: "Cart", to: "/cart" },
                { label: "Wishlist", to: "/wishlist" },
                { label: "Shop", to: "/products" },
              ].map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="text-gray-400 text-sm hover:text-white transition-colors duration-200 block"
                >
                  {label}
                </Link>
              ))}
            </Space>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <h5 className="text-white text-base font-semibold mb-3">Quick Link</h5>
            <Space direction="vertical" size={4}>
              {["Privacy Policy", "Terms Of Use", "FAQ", "Contact"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-400 text-sm hover:text-white transition-colors duration-200 block"
                >
                  {item}
                </a>
              ))}
            </Space>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <h5 className="text-white text-base font-semibold mb-3">Download App</h5>
            <p className="text-gray-500 mb-3">Save $3 with App New User Only</p>
            <Row gutter={[8, 8]} className="mb-4">
              <Col xs={8} sm={6} md={8}>
                <img
                  src={qr}
                  alt="QR Code"
                  loading="lazy"
                  className="w-full bg-white p-1 rounded"
                />
              </Col>
              <Col xs={16} sm={18} md={16}>
                <Space direction="vertical" className="w-full" size={6}>
                  <Button
                    block
                    className="bg-black border-white text-white text-xs py-1"
                  >
                    Get it on Google Play
                  </Button>
                  <Button
                    block
                    className="bg-black border-white text-white text-xs py-1"
                  >
                    App Store
                  </Button>
                </Space>
              </Col>
            </Row>
            <Space size="middle">
              {[
                FacebookOutlined,
                TwitterOutlined,
                InstagramOutlined,
                LinkedinOutlined,
              ].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-white hover:text-gray-300 transition-colors duration-200 p-2"
                >
                  <Icon style={{ fontSize: "20px" }} />
                </a>
              ))}
            </Space>
          </Col>
        </Row>

        <div className="text-center text-gray-600 mt-4 text-xs">
          © Copyright Rimel 2022. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);