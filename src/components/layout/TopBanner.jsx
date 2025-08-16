import { memo, useEffect } from "react";
import { Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveFlashSale } from "../../redux/slices/flashSaleSlice";
import moment from "moment";

const TopBanner = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { activeFlashSale, loading, error } = useSelector((state) => state.flashSale);

  useEffect(() => {
    dispatch(fetchActiveFlashSale());
  }, [dispatch]);

  const getRemainingTime = (endTime) => {
    const now = moment();
    const end = moment(endTime);
    const duration = moment.duration(end.diff(now));

    if (duration.asSeconds() <= 0) {
      return i18n.language === "vi" ? "Khuyến mãi đã kết thúc" : "Sale has ended";
    }

    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();

    if (i18n.language === "vi") {
      return `${days} ngày, ${hours} giờ, ${minutes} phút`;
    }
    return `${days} days, ${hours} hours, ${minutes} minutes`;
  };

  const languageMenuItems = [
    { key: "en", label: "English", onClick: () => i18n.changeLanguage("en") },
    { key: "vi", label: "Tiếng Việt", onClick: () => i18n.changeLanguage("vi") },
  ];

  return (
    <div className="bg-black text-white py-2 text-xs sm:text-sm relative">
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-5 flex items-center justify-center">
        
        {/* Nội dung flash sale */}
        {loading ? (
          <span className="opacity-80">{t("banner.loading")}</span>
        ) : error ? (
          <span className="opacity-80">{t("banner.error")}</span>
        ) : activeFlashSale ? (
          <div className="flex items-center gap-3 text-center">
            <span className="font-semibold">
              {activeFlashSale.name || "Unknown Sale"}
            </span>
            {activeFlashSale.endTime ? (
              <span className="text-yellow-300">
                {i18n.language === "vi" ? "Kết thúc sau" : "Ends in"}{" "}
                {getRemainingTime(activeFlashSale.endTime)}
              </span>
            ) : (
              <span>{t("banner.noEndTime")}</span>
            )}
            <Button
              type="primary"
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
              href="/flashsale"
            >
              {i18n.language === "vi" ? "Mua ngay" : "Shop Now"}
            </Button>
          </div>
        ) : (
          <span className="opacity-80">{t("banner.noActiveSale")}</span>
        )}

        {/* Nút đổi ngôn ngữ */}
        <div className="absolute right-4">
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
    </div>
  );
};

export default memo(TopBanner);
