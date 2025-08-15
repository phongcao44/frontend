import { memo, useState } from "react";
import { Row, Col, Input, Button, Space } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <footer className="bg-black text-white py-10 px-4 sm:px-6">
      <div className="max-w-screen-xl mx-auto">
        <Row gutter={[16, 16]} justify="start">
          <Col xs={24} sm={12} md={6} lg={6}>
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

          <Col xs={24} sm={12} md={6} lg={6}>
            <h5 className="text-white text-base font-semibold mb-3">Support</h5>
            <p className="text-gray-400 mb-2">
              111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.
            </p>
            <p className="text-gray-400 mb-2">
              <a href="mailto:exclusive@gmail.com" className="text-gray-400 hover:text-white transition-colors duration-200">
                exclusive@gmail.com
              </a>
            </p>
            <p className="text-gray-400">
              <a href="tel:+88015888889999" className="text-gray-400 hover:text-white transition-colors duration-200">
                +88015-88888-9999
              </a>
            </p>
          </Col>

          <Col xs={24} sm={12} md={6} lg={6}>
            <h5 className="text-white text-base font-semibold mb-3">Account</h5>
            <Space direction="vertical" size={4}>
              {[
                { label: "My Account", path: "/user/profile" },
                { label: "Login / Register", path: "/login" },
                { label: "Cart", path: "/cart" },
                { label: "Wishlist", path: "/wishlist" },
                { label: "Shop", path: "/products" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.path}
                  className="text-gray-400 text-sm hover:text-white transition-colors duration-200 block"
                >
                  {item.label}
                </a>
              ))}
            </Space>
          </Col>

          <Col xs={24} sm={12} md={6} lg={6}>
            <h5 className="text-white text-base font-semibold mb-3">Quick Link</h5>
            <Space direction="vertical" size={4}>
              {[
                { label: "Privacy Policy", path: "/about" },
                { label: "Terms Of Use", path: "/about" },
                { label: "FAQ", path: "/about" },
                { label: "Contact", path: "/contact" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.path}
                  className="text-gray-400 text-sm hover:text-white transition-colors duration-200 block"
                >
                  {item.label}
                </a>
              ))}
            </Space>
          </Col>
        </Row>

        <div className="text-center mt-6">
          <Space size="middle" className="mb-4">
            {[
              { Icon: FacebookOutlined, href: "https://www.facebook.com" },
              { Icon: TwitterOutlined, href: "https://www.twitter.com" },
              { Icon: InstagramOutlined, href: "https://www.instagram.com" },
              { Icon: LinkedinOutlined, href: "https://www.linkedin.com" },
            ].map(({ Icon, href }, index) => (
              <a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors duration-200 p-2"
              >
                <Icon style={{ fontSize: "20px" }} />
              </a>
            ))}
          </Space>
          <div className="text-gray-600 text-xs">
            © Copyright Rimel 2022. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);