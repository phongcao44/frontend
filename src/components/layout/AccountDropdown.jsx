import { useState, useRef, useEffect, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faShoppingBag,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { logoutUser } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const accountMenuItems = [
  {
    key: "manage",
    labelKey: "accountMenu.manage",
    icon: faUser,
    path: "/user/profile",
  },
  {
    key: "order",
    labelKey: "accountMenu.order",
    icon: faShoppingBag,
    path: "/user/orders",
  },
  {
    key: "cancellations",
    labelKey: "accountMenu.cancellations",
    icon: faCircleXmark,
    path: "/user/orders/cancelled",
  },
  {
    key: "logout",
    labelKey: "accountMenu.logout",
    icon: faRightFromBracket,
    path: "/login",
  },
];

const AccountDropdown = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = async (key) => {
    const item = accountMenuItems.find((i) => i.key === key);

    if (key === "logout") {
      dispatch(logoutUser());
      navigate("/login");
    } else if (item?.path) {
      navigate(item.path);
    }

    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="relative cursor-pointer p-2"
        onClick={toggleDropdown}
        aria-label={t("accountMenu.account")}
      >
        <FontAwesomeIcon icon={faUser} className="w-6 h-6 text-black" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          1
        </span>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-gray-300 to-purple-900 rounded p-1.5 shadow-lg z-50">
          {accountMenuItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-2 text-white text-sm py-2 px-3 rounded cursor-pointer transition-all duration-200 hover:bg-white/30 whitespace-nowrap"
              onClick={() => handleClick(item.key)}
            >
              <FontAwesomeIcon icon={item.icon} className="text-white w-4 h-4" />
              {t(item.labelKey)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(AccountDropdown);