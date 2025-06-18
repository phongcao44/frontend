import { useState } from "react";
import { Layout, Input, Drawer, Grid } from "antd";
import {
  MenuOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import NavMenu from "./NavMenu";
import TopBanner from "./TopBanner";
import AccountDropdown from "./AccountDropdown";

const { Header: AntHeader } = Layout;
const { useBreakpoint } = Grid;

const MainHeader = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const location = useLocation();
  const activePath = location.pathname;
  const screens = useBreakpoint();

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const isMobile = !screens.md;
  const isTablet = screens.md && !screens.lg;

  return (
    <>
      <TopBanner />
      <AntHeader
        style={{
          background: "#fff",
          borderBottom: "1px solid #eee",
          padding: 0,
          height: "auto",
          lineHeight: "normal",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: screens.md ? "space-between" : "space-between",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: isMobile ? "12px 16px" : "16px 20px",
            gap: isMobile ? 12 : 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <MenuOutlined
                onClick={showDrawer}
                style={{
                  fontSize: 20,
                  marginRight: 12,
                  cursor: "pointer",
                }}
              />
            )}
            <div
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#000",
              }}
            >
              Exclusive
            </div>
          </div>

          {screens.md && (
            <div style={{ flex: 1, marginLeft: isTablet ? 24 : 40 }}>
              <NavMenu activePath={activePath} />
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isMobile ? "flex-end" : "flex-start",
              flex: isMobile ? 1 : "unset",
              gap: isMobile ? 14 : isTablet ? 12 : 16,
            }}
          >
            {screens.sm && (
              <Input
                placeholder="What are you looking for?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                suffix={<SearchOutlined style={{ color: "#999" }} />}
                style={{
                  width: isMobile ? 140 : isTablet ? 180 : 250,
                  background: "#f5f5f5",
                  borderRadius: 4,
                  border: "none",
                  padding: isMobile ? "6px 8px" : "8px 12px",
                  fontSize: isMobile ? 14 : 16,
                  flexShrink: 0,
                }}
              />
            )}
            <Link to="/wishlist">
              <HeartOutlined
                style={{ fontSize: isMobile ? 18 : 20, color: "#000" }}
              />
            </Link>
            <Link to="/cart">
              <div style={{ position: "relative" }}>
                <ShoppingCartOutlined
                  style={{ fontSize: isMobile ? 18 : 20, color: "#000" }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-10px",
                    background: "#ff0000",
                    color: "#fff",
                    borderRadius: "50%",
                    width: isMobile ? 14 : 16,
                    height: isMobile ? 14 : 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isMobile ? 9 : 10,
                  }}
                >
                  2
                </span>
              </div>
            </Link>
            <AccountDropdown />
          </div>
        </div>
      </AntHeader>

      <Drawer
        title="Menu"
        placement="left"
        onClose={closeDrawer}
        open={drawerVisible}
        width={isMobile ? "80%" : 260}
        styles={{
          body: {
            padding: 0,
            backgroundColor: "#fff",
          },
        }}
      >
        <NavMenu activePath={activePath} vertical />
      </Drawer>
    </>
  );
};

export default MainHeader;
