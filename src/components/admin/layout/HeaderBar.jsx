/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Layout, Dropdown, Button, Avatar, Typography, theme } from "antd";
import { UserOutlined, PoweroffOutlined } from "@ant-design/icons";
import { logoutUser } from "../../../redux/slices/authSlice";

const { Header } = Layout;
const { Text } = Typography;

const HeaderBar = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

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
          <Avatar icon={<UserOutlined />} size={40} />
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
        <Button danger block onClick={handleLogout}>
          <PoweroffOutlined /> Logout
        </Button>
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
        justifyContent: "flex-end",
        height: 82,
      }}
    >
      <Dropdown
        popupRender={() => userProfileDropdown}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Button type="text" icon={<UserOutlined />} />
      </Dropdown>
    </Header>
  );
};

export default HeaderBar;
