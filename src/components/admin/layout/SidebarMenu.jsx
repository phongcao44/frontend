import { Menu } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  PictureOutlined,
  CreditCardOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      defaultOpenKeys={["/admin/products"]}
      style={{ height: "100%", borderRight: 0 }}
      onClick={({ key }) => navigate(key)}
      items={[
        {
          key: "/admin/dashboard",
          icon: <DashboardOutlined />,
          label: "Bảng điều khiển",
        },
        { 
          icon: <AppstoreOutlined />,
          label: "Sản phẩm",
          children: [
            {
              key: "/admin/products",
              label: "Tất cả sản phẩm",
            },
            {
              key: "/admin/products/groups",
              label: "Nhóm sản phẩm",
            },
            {
              key: "/admin/products/pricing",
              label: "Bảng giá",
            },
            {
              key: "/admin/products/stock",
              label: "Tồn kho",
            },
          ],
        },
        {
          key: "/admin/categories",
          icon: <TagsOutlined />,
          label: "Danh mục",
        },
        {
          key: "/admin/orders",
          icon: <ShoppingCartOutlined />,
          label: "Đơn hàng",
        },
        {
          key: "/admin/users",
          icon: <UserOutlined />,
          label: "Người dùng",
        },
        {
          key: "/admin/payments",
          icon: <CreditCardOutlined />,
          label: "Thanh toán",
        },
        {
          key: "/admin/banners",
          icon: <PictureOutlined />,
          label: "Banner quảng cáo",
        },
        {
          key: "/admin/reviews",
          icon: <StarOutlined />,
          label: "Đánh giá sản phẩm",
        },
      ]}
    />
  );
};

export default SidebarMenu;
