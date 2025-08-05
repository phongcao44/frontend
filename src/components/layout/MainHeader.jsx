import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NavMenu from "./NavMenu";
import TopBanner from "./TopBanner";
import AccountDropdown from "./AccountDropdown";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { checkAuthFromStorage } from "../../utils/authUtils";

const MainHeader = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cart);
  const itemCount = cart?.items?.length || 0;

  const activePath = location.pathname;
  const authState = useSelector((state) => state.auth.isLoggedIn);
  const token = Cookies.get("access_token");

  // Check both Redux state and localStorage
  const isLoggedInFromStorage = checkAuthFromStorage();
  const finalIsLoggedIn = authState || isLoggedInFromStorage || !!token;

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (trimmed) {
      navigate(`/products/search?keyword=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <>
      <TopBanner />
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-5 py-3 sm:py-4 gap-3">
          <div className="flex items-center">
            <button
              className="md:hidden text-2xl mr-3 cursor-pointer"
              onClick={showDrawer}
              aria-label={t("header.openMenu")}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="text-2xl font-bold text-black">Exclusive</div>
          </div>

          <div className="hidden md:flex flex-1 md:ml-6 lg:ml-10">
            <NavMenu activePath={activePath} />
          </div>

          <div className="flex items-center justify-end flex-1 md:flex-none gap-3 sm:gap-3 md:gap-4">
            <div className="hidden sm:flex items-center">
              <input
                type="text"
                placeholder={t("header.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="w-36 sm:w-44 md:w-64 bg-gray-100 rounded-md border-none py-1.5 px-3 sm:py-2 sm:px-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Link to="/wishlist" aria-label={t("header.wishlist")}>
              <svg
                className="w-5 h-5 sm:w-5 sm:h-5 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </Link>
            <Link to="/cart" className="relative" aria-label={t("header.cart")}>
              <svg
                className="w-5 h-5 sm:w-5 sm:h-5 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white rounded-full w-4 h-4 sm:w-4 sm:h-4 flex items-center justify-center text-[9px] sm:text-[10px]">
                {itemCount}
              </span>
            </Link>
            {finalIsLoggedIn ? (
              <AccountDropdown />
            ) : (
              <Link to="/signup" aria-label={t("header.signUp")}>
                <svg
                  className="w-5 h-5 sm:w-5 sm:h-5 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-y-0 left-0 bg-white w-4/5 md:w-64 transform ${drawerVisible ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <span className="text-lg font-semibold">{t("header.menu")}</span>
          <button onClick={closeDrawer} aria-label={t("header.closeMenu")}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-0 bg-white">
          <NavMenu activePath={activePath} vertical />
        </div>
      </div>
      {drawerVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeDrawer}
        ></div>
      )}
    </>
  );
};

export default MainHeader;