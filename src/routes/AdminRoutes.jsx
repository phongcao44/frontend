import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import ErrorPage from "../pages/user/ErrorPage";

// Dashboard
import Revenue from "../pages/admin/dashboard/Revenue";

// Return
import ReturnRequestList from "../pages/admin/return/ReturnRequestList";
import ReturnRequestDetail from "../pages/admin/return/ReturnRequestDetail";

// Products
import ProductManagement from "../pages/admin/product/ProductManagement";
import ProductForm from "../pages/admin/product/ProductForm";
import ProductVariantDetail from  "../pages/admin/product/ProductVariantDetail";
import StockManagement from "../pages/admin/StockManagement";

// Orders
import OrderManagement from "../pages/admin/OrderManagement";
import OrderDetail from "../pages/admin/OrderDetail";

// Categories
import CategoryManagement from "../pages/admin/CategoryManagement";

// Users
import UserManagement from "../pages/admin/User/userManagement/UserManagement";
import UserDetail from "../pages/admin/User/userDetail/UserDetail";

// Banners
import BannerManagement from "../pages/admin/banner/BannerManagement";

// Reviews & Support
import ReviewManagement from "../pages/admin/ReviewManagement";
import Support from "../pages/admin/Support";

import FlashSaleManagement from "../pages/admin/flash_Sale/FlashSaleManagement";
import FlashSaleItemManagement from "../pages/admin/flash_Sale/FlashSaleItemManagement";

import VoucherManagement from "../pages/admin/voucher/VoucherManagement";
import PostManagement from "../pages/admin/posts/PostManagement";

export default function AdminRoutes() {
  return (
    <Route
      element={
        <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      {/* Dashboard */}
      <Route path="/admin/dashboard" element={<Revenue />} />

      {/* Return */}
      <Route path="/admin/return" element={<ReturnRequestList />} />
      <Route path="/admin/return/:id" element={<ReturnRequestDetail />} />

      {/* Products */}
      <Route path="/admin/products" element={<ProductManagement />} />
      <Route path="/admin/products/add" element={<ProductForm />} />
      <Route path="/admin/products/:id" element={<ProductForm />} />
      <Route
        path="/admin/products/:id/variant"
        element={<ProductVariantDetail />}
      />
      <Route path="/admin/products/stock" element={<StockManagement />} />

      {/* Orders */}
      <Route path="/admin/orders" element={<OrderManagement />} />
      <Route path="/admin/orders/:orderId" element={<OrderDetail />} />

      {/* Categories */}
      <Route path="/admin/categories" element={<CategoryManagement />} />

      {/* Users */}
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/users/:userId" element={<UserDetail />} />

      {/* Banners */}
      <Route path="/admin/banner" element={<BannerManagement />} />

      {/* Flash Sale */}
      <Route path="/admin/flash-sale" element={<FlashSaleManagement />} />
      <Route
        path="/admin/flash-sale/:id"
        element={<FlashSaleItemManagement />}
      />

      {/* Posts */}
      <Route path="/admin/posts" element={<PostManagement />} />

      {/* Voucher */}
      <Route path="/admin/voucher" element={<VoucherManagement />} />

      {/* Reviews & Support */}
      <Route path="/admin/reviews" element={<ReviewManagement />} />
      <Route path="/admin/support" element={<Support />} />

      {/* Fallback */}
      <Route path="/admin/*" element={<ErrorPage />} />
    </Route>
  );
}
