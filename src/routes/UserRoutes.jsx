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
import ProfilePage from "../pages/user/account/ProfilePage";
import EditProfilePage from "../pages/user/account/EditProfilePage";
import AddressBook from "../pages/user/account/AddressBook";

import Orders from "../pages/user/account/Orders";
import AllOrders from "../pages/user/account/AllOrders";
import OrderStatusList from "../pages/user/account/OrderStatusList";
import OrderDetail from "../pages/user/account/OrderDetail";
import OrderSuccessPage from "../pages/user/order-success/OrderSuccessPage";
import OrderFailedPage from "../pages/user/order-failed/OrderFailedPage";
import VNPayCallback from "../pages/user/payment/VNPayCallback";

import ProductSearch from "../pages/user/productList/ProductSearch";
import Blog from "../pages/user/Blog";
import BlogDetail from "../pages/user/BlogDetail";
import OAuth2Redirect from "../pages/user/OAuth2Redirect";
import FlashSaleProducts from "../pages/user/productList/FlashSaleProducts";
import BestSellingProducts from "../pages/user/productList/BestSellingProducts";
import DeliveredProductSection from "../components/user/DeliveredProductSection";
import MyReturnRequests from "../components/user/returnRequestSection";
import VoucherSection from "../pages/user/account/VoucherSection";

const UserRoutes = () => {
  return (
    <>
      <Route path="/" element={<MainLayout />}>
        {/* Home */}
        <Route index element={<Home />} />

        {/* Product Listing & Detail */}
        <Route path="products" element={<ProductListing />} />
        <Route path="products/search" element={<ProductSearch />} />
        <Route path="products/category/:slug" element={<ProductListing />} />
        {/* <Route path="product/:id" element={<ProductDetail />} /> */}
        <Route path="product/:slug" element={<ProductDetail />} />

        <Route path="wishlist" element={<WishList />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<CheckoutPage />} />

        <Route path="flashsale" element={<FlashSaleProducts />} />
        <Route path="bestselling" element={<BestSellingProducts />} />

        {/* User Account */}

        <Route path="user/" element={<UserAccountPage />}>
          <Route index element={<ProfilePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="edit-profile" element={<EditProfilePage />} />
          <Route path="addresses" element={<AddressBook />} />
          <Route path="orders" element={<Orders />}>
            <Route index element={<AllOrders />} />
            <Route path=":status" element={<OrderStatusList />} />
          </Route>
          <Route path="order/:id" element={<OrderDetail />} />
          <Route path="wishlist" element={<WishList />} />
          <Route path="myVouchers" element={<VoucherSection />} />
          <Route path="deliveredProduct" element={<DeliveredProductSection />} />
          <Route path="returns" element={<MyReturnRequests />} />
        </Route>
        <Route path="payment-success/:orderId" element={<OrderSuccessPage />} />
        <Route path="payment-failed/:orderId" element={<OrderFailedPage />} />
        <Route path="vnpay-callback" element={<VNPayCallback />} />

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
