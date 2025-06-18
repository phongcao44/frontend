import React from "react";
import { Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faShoppingBag,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  faStar as faStarRegular,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";

const accountMenuItems = [
  {
    key: "manage",
    label: "Manage My Account",
    icon: faUser,
  },
  {
    key: "order",
    label: "My Order",
    icon: faShoppingBag,
  },
  {
    key: "cancellations",
    label: "My Cancellations",
    icon: faCircleXmark,
  },
  {
    key: "reviews",
    label: "My Reviews",
    icon: faStarRegular,
  },
  {
    key: "logout",
    label: "Logout",
    icon: faRightFromBracket,
  },
];

const AccountDropdown = () => {
  const handleClick = ({ key }) => {
    console.log("Clicked:", key);
  };

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      menu={{
        items: accountMenuItems.map((item) => ({
          key: item.key,
          label: (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#fff",
                fontSize: 14,
              }}
            >
              <FontAwesomeIcon icon={item.icon} style={{ color: "#fff" }} />
              {item.label}
            </div>
          ),
        })),
        onClick: handleClick,
      }}
      popupRender={(menuNode) => (
        <div
          style={{
            background: "linear-gradient(to bottom right, #D3D8DC, #4A2A60)",
            borderRadius: 4,
            padding: 6,
            minWidth: 180,
            maxWidth: 200,
          }}
        >
          {React.cloneElement(menuNode, {
            style: { background: "transparent" },
            children: React.Children.map(menuNode.props.children, (child) =>
              React.cloneElement(child, {
                style: {
                  ...child.props.style,
                  color: "#fff",
                  backgroundColor: "transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 10px",
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "background 0.3s",
                  fontSize: 14,
                  whiteSpace: "nowrap",
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.color = "#fff";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#fff";
                },
              })
            ),
          })}
        </div>
      )}
    >
      <div style={{ position: "relative", cursor: "pointer" }}>
        <UserOutlined style={{ fontSize: 18, color: "#000" }} />
        <span
          style={{
            position: "absolute",
            top: "-5px",
            right: "-10px",
            background: "#ff0000",
            color: "#fff",
            borderRadius: "50%",
            width: 14,
            height: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
          }}
        >
          1
        </span>
      </div>
    </Dropdown>
  );
};

export default AccountDropdown;
