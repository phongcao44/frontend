import { Route } from "react-router-dom";
import MainLayout from "../layouts/UserLayout";

// --- Pages ---
import Home from "../pages/user/Home";
import ProductListing from "../pages/user/productList/ProductListing";
import ProductDetail from "../pages/user/productDetail/ProductDetail";
import WishList from "../pages/user/WishList";
import Cart from "../pages/user/Cart";
import CheckoutPage from "../pages/user/checkout/CheckoutPage";

import DeliveredProductsPage from "../pages/user/Delivered";
import ReturnForm from "../pages/user/ReturnForm"; 
import ReturnRequestsPage from "../pages/user/ReturnRequestsPage"; 

// --- Auth ---
import Login from "../pages/user/Login";
import SignUp from "../pages/user/SignUp";
import ForgotPassword from "../pages/user/ForgotPassword";
import ResetPassword from "../pages/user/ResetPassword";

// --- Other ---
import About from "../pages/user/About";
import Contact from "../pages/user/Contact";
import ErrorPage from "../pages/user/ErrorPage";
import UserAccountPage from "../pages/user/account/UserAccountPage";
import EditProfileForm from "../pages/user/account/EditProfileForm";
import AddressBook from "../pages/user/account/AddressBook";

import Orders from "../pages/user/account/Orders";
import OrderSuccessPage from "../pages/user/order-success/OrderSuccessPage";

import ProductSearch from "../pages/user/productList/ProductSearch";
import Blog from "../pages/user/Blog";
import BlogDetail from "../pages/user/BlogDetail";
import OAuth2Redirect from "../pages/user/OAuth2Redirect";

const UserRoutes = () => {
  return (
    <>
      <Route path="/" element={<MainLayout />}>
        {/* Home */}
        <Route index element={<Home />} />

        {/* Product Listing & Detail */}
        <Route path="products" element={<ProductListing />} />
        <Route path="products/search" element={<ProductSearch />} />
        <Route path="products/category/:id" element={<ProductListing />} />
        <Route path="product/:id" element={<ProductDetail />} />

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

        <Route path="payment-success/:orderId" element={<OrderSuccessPage />} />
        <Route path="/payment-failed/:orderId" element={<ErrorPage />} />

        {/* Auth */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="oauth2/redirect" element={<OAuth2Redirect />} />

        {/* Info */}
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />


        {/* Default Redirect */}
        <Route path="*" element={<ErrorPage />} />


        <Route path="delivered-products" element={<DeliveredProductsPage />} />
        <Route path="return-form" element={<ReturnForm />} />

        <Route path="return-requests" element={<ReturnRequestsPage />} />

          <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      </Route>
    </>
  );
};

export default UserRoutes;
