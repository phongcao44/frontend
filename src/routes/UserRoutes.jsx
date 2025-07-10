import { Navigate, Route } from "react-router-dom";
import MainLayout from "../layouts/UserLayout";

import Home from "../pages/user/Home";
import Login from "../pages/user/Login";
import SignUp from "../pages/user/SignUp";
import Contact from "../pages/user/Contact";
import About from "../pages/user/About";
import ErrorPage from "../pages/user/ErrorPage";
import WishList from "../pages/user/WishList";
import Cart from "../pages/user/Cart";
import ProductDetail from "../pages/user/ProductDetail";
import CheckoutPage from "../pages/user/checkout/CheckoutPage";

const UserRoutes = () => {
  return (
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Navigate to="/signup" replace />} />

      <Route path="home" element={<Home />} />

      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="contact" element={<Contact />} />
      <Route path="about" element={<About />} />

      <Route path="/product/:id" element={<ProductDetail />} />

      <Route path="wishlist" element={<WishList />} />
      <Route path="cart" element={<Cart />} />

      <Route path="checkout" element={<CheckoutPage />} />

      <Route path="*" element={<ErrorPage />} />
    </Route>
  );
};

export default UserRoutes;
