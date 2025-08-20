import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NavMenu from "./NavMenu";
import TopBanner from "./TopBanner";
import AccountDropdown from "./AccountDropdown";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { checkAuthFromStorage } from "../../utils/authUtils";
import { getCart } from "../../redux/slices/cartSlice"; // Import cart thunk
import { getUserWishlist } from "../../redux/slices/wishlistSlice"; // Import wishlist thunk

const MainHeader = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get cart and wishlist from Redux store
  const cart = useSelector((state) => state.cart.cart);
  const wishlist = useSelector((state) => state.wishlist.items);
  const itemCount = cart?.items?.length || 0;
  const wishlistCount = wishlist?.length || 0; // Wishlist item count

  const activePath = location.pathname;
  const authState = useSelector((state) => state.auth.isLoggedIn);
  const token = Cookies.get("access_token");

  // Check both Redux state and localStorage
  const isLoggedInFromStorage = checkAuthFromStorage();
  const finalIsLoggedIn = authState || isLoggedInFromStorage || !!token;

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);
  const toggleSearch = () => setSearchVisible(!searchVisible);

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (trimmed) {
      navigate(`/products/search?keyword=${encodeURIComponent(trimmed)}`);
      setSearchVisible(false); // Close mobile search after searching
    }
  };

  // Handle logo click
  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  // Fetch cart and wishlist data on component mount
  useEffect(() => {
    if (finalIsLoggedIn) {
      dispatch(getCart()); // Fetch cart data
      dispatch(getUserWishlist()); // Fetch wishlist data
    }
  }, [dispatch, finalIsLoggedIn]);

  // Close drawer when clicking outside or on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setDrawerVisible(false);
        setSearchVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <TopBanner />
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        {/* Mobile Search Bar */}
        {searchVisible && (
          <div className="sm:hidden bg-gray-50 p-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={t("header.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="flex-1 bg-white rounded-lg border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                aria-label={t("header.search")}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button
                onClick={() => setSearchVisible(false)}
                className="text-gray-500 p-1"
                aria-label={t("header.closeSearch")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 gap-2 sm:gap-3">
          {/* Left Section - Menu Button & Logo */}
          <div className="flex items-center min-w-0">
            <button
              className="md:hidden text-gray-700 mr-2 sm:mr-3 p-1 hover:bg-gray-100 rounded-md transition-colors"
              onClick={showDrawer}
              aria-label={t("header.openMenu")}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div
              onClick={handleLogoClick}
              className="flex-shrink-0 cursor-pointer"
            >
              <div className="text-xl sm:text-2xl font-bold text-black hover:text-gray-700 transition-colors">
                Exclusive
              </div>
            </div>
          </div>

          {/* Middle Section - Navigation Menu (Desktop/Tablet) */}
          <div className="hidden md:flex flex-1 md:ml-4 lg:ml-6 xl:ml-10 max-w-2xl">
            <NavMenu activePath={activePath} />
          </div>

          {/* Right Section - Search & Icons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Search Input (Tablet & Desktop) */}
            <div className="hidden sm:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("header.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  className="w-32 sm:w-40 md:w-48 lg:w-64 bg-gray-100 rounded-lg border-none py-2 px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={t("header.search")}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Search Icon */}
            <button
              className="sm:hidden text-gray-700 p-1.5 hover:bg-gray-100 rounded-md transition-colors"
              onClick={toggleSearch}
              aria-label={t("header.search")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Wishlist Icon with Counter */}
            <Link
              to="/wishlist"
              className="relative text-gray-700 hover:text-red-500 p-1.5 hover:bg-gray-100 rounded-md transition-all duration-200"
              aria-label={t("header.wishlist")}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-medium animate-pulse">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon with Counter */}
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-blue-600 p-1.5 hover:bg-gray-100 rounded-md transition-all duration-200"
              aria-label={t("header.cart")}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-medium animate-pulse">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Account Icon or Dropdown */}
            {finalIsLoggedIn ? (
              <AccountDropdown />
            ) : (
              <Link
                to="/signup"
                className="text-gray-700 hover:text-green-600 p-1.5 hover:bg-gray-100 rounded-md transition-all duration-200"
                aria-label={t("header.signUp")}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile/Tablet Drawer Menu */}
      <div
        className={`fixed inset-y-0 left-0 bg-white w-4/5 sm:w-80 md:w-64 transform ${
          drawerVisible ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 shadow-xl`}
      >
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-lg sm:text-xl font-semibold text-gray-800">{t("header.menu")}</span>
          </div>
          <button
            onClick={closeDrawer}
            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-200 rounded-md transition-colors"
            aria-label={t("header.closeMenu")}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-3 sm:p-4 bg-white h-full overflow-y-auto">
          <NavMenu activePath={activePath} vertical />
        </div>
      </div>

      {drawerVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeDrawer}
        ></div>
      )}
    </>
  );
};

export default MainHeader;