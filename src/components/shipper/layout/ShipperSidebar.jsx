import { Menu } from "antd";
import { ShoppingCartOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const ShipperSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      style={{ height: "100%", borderRight: 0 }}
      onClick={({ key }) => navigate(key)}
      items={[
        {
          key: "/shipper/dashboard",
          icon: <ShoppingCartOutlined />,
          label: "Đơn hàng",
        },
        // You can add more shipper-specific items here when routes are available
        // {
        //   key: "/shipper/tracking",
        //   icon: <EnvironmentOutlined />,
        //   label: "Theo dõi vị trí",
        // },
      ]}
    />
  );
};

export default ShipperSidebar;
