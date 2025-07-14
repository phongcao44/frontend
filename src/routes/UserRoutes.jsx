import { Route } from "react-router-dom";
import MainLayout from "../layouts/UserLayout";

// --- Pages ---
import Home from "../pages/user/Home";
import ProductListingPage from "../pages/user/productList/ProductListingPage";
import ProductDetail from "../pages/user/productDetail/ProductDetail";
import WishList from "../pages/user/WishList";
import Cart from "../pages/user/Cart";
import CheckoutPage from "../pages/user/checkout/CheckoutPage";
import ReturnForm from "../pages/user/ReturnProduct";

// --- Auth ---
import Login from "../pages/user/Login";
import SignUp from "../pages/user/SignUp";

// --- Other ---
import About from "../pages/user/About";
import Contact from "../pages/user/Contact";
import ErrorPage from "../pages/user/ErrorPage";
import UserAccountPage from "../pages/user/account/UserAccountPage";
import EditProfileForm from "../pages/user/account/EditProfileForm";
import AddressBook from "../pages/user/account/AddressBook";
import Orders from "../pages/user/account/Orders";

const UserRoutes = () => {
  return (
    <>
      <Route path="/" element={<MainLayout />}>
        {/* Home */}
        <Route index element={<Home />} />

        {/* Product Listing & Detail */}
        <Route path="products" element={<ProductListingPage />} />
        <Route path="products/category/:id" element={<ProductListingPage />} />
        <Route path="product/:id" element={<ProductDetail />} />

        {/* Flash Sale & Best Selling */}
        {/* <Route path="flash-sale" element={<FlashSalePage />} />
        <Route path="best-selling" element={<BestSellingPage />} /> */}

        {/* Search */}
        {/* <Route path="search" element={<SearchPage />} /> */}

        {/* Wishlist, Cart, Checkout */}
        <Route path="wishlist" element={<WishList />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<CheckoutPage />} />

        {/* User Account */}

        <Route path="user/" element={<UserAccountPage />}>
          <Route index element={<EditProfileForm />} />
          <Route path="profile" element={<EditProfileForm />} />
          <Route path="addresses" element={<AddressBook />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        {/* Auth */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        {/* <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} /> */}

        {/* Info */}
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

          <Route path="return-product" element={<ReturnForm />} />

        {/* Default Redirect */}
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </>
  );
};

export default UserRoutes;
