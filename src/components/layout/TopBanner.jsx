import { memo } from "react";
import { Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const TopBanner = () => {
  const { t, i18n } = useTranslation();

  const languageMenuItems = [
    { key: "en", label: "English", onClick: () => i18n.changeLanguage("en") },
    { key: "vi", label: "Tiếng Việt", onClick: () => i18n.changeLanguage("vi") },
  ];

  return (
    <div className="bg-black text-white py-2 text-xs sm:text-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-5 flex items-center justify-between flex-wrap">
        <span className="opacity-80">
          {t("banner.saleText")}{" "}
          <span className="underline font-bold opacity-100">
            {t("banner.shopNow")}
          </span>
        </span>
        <Dropdown
          menu={{ items: languageMenuItems }}
          trigger={["click"]}
          placement="bottomRight"
          overlayClassName="min-w-[120px]"
        >
          <Button
            type="link"
            className="text-white p-2 min-h-[44px] flex items-center"
            aria-label={t("banner.changeLanguage")}
          >
            {i18n.language === "vi" ? "Tiếng Việt" : "English"}
            <DownOutlined className="ml-1 text-sm" />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};

export default memo(TopBanner);