/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Layout,
  Menu,
  Dropdown,
  Button,
  Input,
  Badge,
  Avatar,
  List,
  Card,
  Space,
  Typography,
  theme,
} from "antd";
import {
  MenuOutlined,
  SearchOutlined,
  SunOutlined,
  MoonOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  PoweroffOutlined,
  LockOutlined,
  CustomerServiceOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { logoutUser } from "../../../redux/slices/authSlice";
import Cookies from "js-cookie";

const { Header } = Layout;
const { Text, Title } = Typography;
const { Search } = Input;

const HeaderBar = ({ collapsed, setCollapsed }) => {
  // eslint-disable-next-line no-unused-vars
  const [, setCurrentTheme] = useState("light");
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    Cookies.remove("access_token", { path: "/" });
    Cookies.remove("user", { path: "/" });

    dispatch(logoutUser());
    navigate("/login");
  };

  const notifications = [
    {
      id: 1,
      avatar: "...",
      title: "UI/UX Design",
      description: "...",
      time: "2 min ago",
      type: "today",
    },
    {
      id: 2,
      avatar: "...",
      title: "Message",
      description: "...",
      time: "1 hour ago",
      type: "today",
    },
    {
      id: 3,
      avatar: "...",
      title: "Forms",
      description: "...",
      time: "2 hour ago",
      type: "yesterday",
    },
    {
      id: 4,
      avatar: "...",
      title: "Challenge invitation",
      description: "...",
      time: "12 hour ago",
      type: "yesterday",
      hasActions: true,
    },
    {
      id: 5,
      avatar: "...",
      title: "Security",
      description: "...",
      time: "5 hour ago",
      type: "yesterday",
    },
  ];

  const themeMenu = {
    items: [
      {
        key: "dark",
        icon: <MoonOutlined />,
        label: "Dark",
        onClick: () => setCurrentTheme("dark"),
      },
      {
        key: "light",
        icon: <SunOutlined />,
        label: "Light",
        onClick: () => setCurrentTheme("light"),
      },
      {
        key: "default",
        icon: <SettingOutlined />,
        label: "Default",
        onClick: () => setCurrentTheme("default"),
      },
    ],
  };

  const settingsMenu = {
    items: [
      { key: "account", icon: <UserOutlined />, label: "My Account" },
      { key: "settings", icon: <SettingOutlined />, label: "Settings" },
      { key: "support", icon: <CustomerServiceOutlined />, label: "Support" },
      { key: "lock", icon: <LockOutlined />, label: "Lock Screen" },
      {
        key: "logout",
        icon: <PoweroffOutlined />,
        label: "Logout",
        onClick: handleLogout,
      },
    ],
  };

  const userProfileMenu = {
    items: [
      { key: "settings", icon: <SettingOutlined />, label: "Settings" },
      { key: "share", icon: <ShareAltOutlined />, label: "Share" },
      {
        key: "change-password",
        icon: <LockOutlined />,
        label: "Change Password",
      },
      { type: "divider" },
      {
        key: "logout",
        icon: <PoweroffOutlined />,
        label: (
          <Button type="primary" block onClick={handleLogout}>
            <PoweroffOutlined /> Logout
          </Button>
        ),
      },
    ],
  };

  const searchDropdown = (
    <div style={{ width: 300, padding: "8px" }}>
      <Search
        placeholder="Search here..."
        allowClear
        enterButton
        size="large"
      />
    </div>
  );

  const notificationsDropdown = (
    <div
      style={{
        width: 380,
        maxHeight: "calc(100vh - 200px)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          Notifications
        </Title>
        <Button type="link" size="small">
          Mark all read
        </Button>
      </div>
      <div
        style={{
          maxHeight: "calc(100vh - 280px)",
          overflowY: "auto",
          padding: "16px 20px",
        }}
      >
        <Text type="secondary" style={{ fontSize: "12px", fontWeight: 500 }}>
          Today
        </Text>
        <List
          itemLayout="horizontal"
          dataSource={notifications.filter((n) => n.type === "today")}
          renderItem={(item) => (
            <List.Item style={{ padding: "12px 0", border: "none" }}>
              <Card size="small" style={{ width: "100%", marginBottom: 8 }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <Avatar src={item.avatar} size={48} />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <Text strong>{item.title}</Text>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {item.time}
                      </Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: "13px" }}>
                      {item.description}
                    </Text>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
        <Text
          type="secondary"
          style={{
            fontSize: "12px",
            fontWeight: 500,
            marginTop: 16,
            display: "block",
          }}
        >
          Yesterday
        </Text>
        <List
          itemLayout="horizontal"
          dataSource={notifications.filter((n) => n.type === "yesterday")}
          renderItem={(item) => (
            <List.Item style={{ padding: "12px 0", border: "none" }}>
              <Card size="small" style={{ width: "100%", marginBottom: 8 }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <Avatar src={item.avatar} size={48} />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <Text strong>{item.title}</Text>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {item.time}
                      </Text>
                    </div>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: "13px",
                        marginBottom: item.hasActions ? 8 : 0,
                      }}
                    >
                      {item.description}
                    </Text>
                    {item.hasActions && (
                      <Space>
                        <Button size="small">Decline</Button>
                        <Button type="primary" size="small">
                          Accept
                        </Button>
                      </Space>
                    )}
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
      <div
        style={{
          textAlign: "center",
          padding: "12px",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <Button type="link" danger>
          Clear all Notifications
        </Button>
      </div>
    </div>
  );

  const userProfileDropdown = (
    <div style={{ width: 280 }}>
      <div
        style={{
          padding: "16px 20px",
          background: token.colorPrimary,
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
            size={40}
          />
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              Carson Darrin 🖖
            </div>
            <div style={{ fontSize: "12px", opacity: 0.9 }}>
              carson.darrin@company.io
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 20px" }}>
        <Menu
          mode="vertical"
          style={{ border: "none" }}
          items={userProfileMenu.items}
        />
      </div>
    </div>
  );

  return (
    <Header
      style={{
        background: token.colorBgContainer,
        padding: "0 24px",
        borderBottom: `1px solid ${token.colorBorder}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 82,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setCollapsed(!collapsed)}
        />
        <Dropdown
          popupRender={() => searchDropdown}
          trigger={["click"]}
          placement="bottomLeft"
        >
          <Button type="text" icon={<SearchOutlined />} />
        </Dropdown>
      </div>
      <Space size="small">
        <Dropdown menu={themeMenu} trigger={["click"]}>
          <Button type="text" icon={<SunOutlined />} />
        </Dropdown>
        <Dropdown menu={settingsMenu} trigger={["click"]}>
          <Button type="text" icon={<SettingOutlined />} />
        </Dropdown>
        <Dropdown
          popupRender={() => notificationsDropdown}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Badge count={3} size="small">
            <Button type="text" icon={<BellOutlined />} />
          </Badge>
        </Dropdown>
        <Dropdown
          popupRender={() => userProfileDropdown}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button type="text" icon={<UserOutlined />} />
        </Dropdown>
      </Space>
    </Header>
  );
};

export default HeaderBar;
