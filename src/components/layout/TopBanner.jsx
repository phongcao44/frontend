import { Typography, Dropdown, Button, Grid } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Text } = Typography;
const { useBreakpoint } = Grid;

const TopBanner = () => {
  const screens = useBreakpoint();
  const { t, i18n } = useTranslation();

  if (!screens.md) return null;

  const languageMenuItems = [
    {
      key: "en",
      label: "English",
      onClick: () => i18n.changeLanguage("en"),
    },
    {
      key: "vi",
      label: "Tiếng Việt",
      onClick: () => i18n.changeLanguage("vi"),
    },
  ];

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
          {t("banner.saleText")}{" "}
          <Text underline strong style={{ color: "#fff", opacity: 1 }}>
            {t("banner.shopNow")}
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
              {i18n.language === "vi" ? "Tiếng Việt" : "English"} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
