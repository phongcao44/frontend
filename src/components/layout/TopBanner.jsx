import { Typography, Dropdown, Button, Grid } from "antd";
import { DownOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { useBreakpoint } = Grid;

const languageMenuItems = [
  { key: "en", label: "English" },
  { key: "vi", label: "Tiếng Việt" },
];

const TopBanner = () => {
  const screens = useBreakpoint();
  if (!screens.md) return null;

  return (
    <div
      style={{
        background: "#000",
        color: "#fff",
        padding: "8px 0",
        fontSize: 12,
        position: "relative",
        overflowX: "auto",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          position: "relative",
          textAlign: "center",
        }}
      >
        <span style={{ opacity: 0.8 }}>
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{" "}
          <Text underline strong style={{ color: "#fff", opacity: 1 }}>
            ShopNow
          </Text>
        </span>

        <div
          style={{
            position: "absolute",
            right: 20,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <Dropdown
            menu={{ items: languageMenuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button type="link" style={{ color: "#fff", padding: 0 }}>
              English <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
