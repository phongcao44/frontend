import { Layout } from "antd";
import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import SidebarMenu from "../components/admin/layout/SidebarMenu";
import HeaderBar from "../components/admin/layout/HeaderBar";

const { Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <Link
          to="/admin/dashboard"
          className="logo"
          style={{
            height: 50,
            margin: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? 0 : "0 12px",
            transition: "all 0.3s",
            textDecoration: "none",
          }}
        >
          <img
            src="/assets/images/logo.png"
            alt="Logo"
            style={{ width: 32, height: 32 }}
          />
          {!collapsed && (
            <span
              style={{
                marginLeft: 8,
                color: "#fff",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              MyShop
            </span>
          )}
        </Link>
        <SidebarMenu />
      </Sider>
      <Layout>
        <HeaderBar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content
          style={{ margin: "16px 16px", padding: 24, background: "#fff" }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
