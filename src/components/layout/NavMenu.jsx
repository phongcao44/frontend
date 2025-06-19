import { Link } from "react-router-dom";
import { Menu } from "antd";

const menuItems = [
  { key: "home", label: "Home", path: "/" },
  { key: "contact", label: "Contact", path: "/contact" },
  { key: "about", label: "About", path: "/about" },
  { key: "signup", label: "Sign Up", path: "/signup" },
];

// eslint-disable-next-line react/prop-types
const NavMenu = ({ activePath, vertical = false }) => {
  if (vertical) {
    return (
      <Menu
        mode="vertical"
        selectedKeys={[activePath]}
        items={menuItems.map((item) => ({
          key: item.path,
          label: <Link to={item.path}>{item.label}</Link>,
        }))}
      />
    );
  }

  return (
    <nav style={{ flex: 1, display: "flex", justifyContent: "center" }}>
      <ul
        style={{
          display: "flex",
          listStyle: "none",
          margin: 0,
          padding: 0,
          gap: "48px",
        }}
      >
        {menuItems.map(({ key, label, path }) => (
          <li key={key}>
            <Link
              to={path}
              style={{
                textDecoration: "none",
                color: "#000",
                fontSize: "16px",
                borderBottom:
                  activePath === path
                    ? "2px solid #aaa"
                    : "2px solid transparent",
                paddingBottom: "4px",
              }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavMenu;
