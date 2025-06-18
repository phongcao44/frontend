import { Route } from "react-router-dom";
import MainLayout from "../layouts/UserLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Contact from "../pages/Contact";
import About from "../pages/About";
import NotFound from "../pages/NotFound";
import WishList from "../pages/WishList";
import Cart from "../pages/Cart";

const UserRoutes = () => {
  return (
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="contact" element={<Contact />} />
      <Route path="about" element={<About />} />

      <Route path="wishlist" element={<WishList />} />
      <Route path="cart" element={<Cart />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  );
};

export default UserRoutes;
