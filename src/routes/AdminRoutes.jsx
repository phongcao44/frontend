import { Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ErrorPage from "../pages/ErrorPage";

// Dashboard
import Dashboard from "../pages/admin/Dashboard";

// Products
import ProductManagement from "../pages/admin/ProductManagement";
import ProductForm from "../components/product/ProductForm";
import ProductVariantDetail from "../components/product/ProductVariantDetail";
import StockManagement from "../pages/admin/StockManagement";

// Orders
import OrderManagement from "../pages/admin/OrderManagement";
import OrderDetail from "../pages/admin/OrderDetail";

// Categories
import CategoryManagement from "../pages/admin/CategoryManagement";

// Users
import UserManagement from "../pages/admin/UserManagement";

// Banners
import BannerManagement from "../pages/admin/BannerManagement";
import BannerForm from "../pages/admin/BannerForm";

// Reviews & Support
import ReviewManagement from "../pages/admin/ReviewManagement";
import Support from "../pages/admin/Support";

function AdminRoutes() {
  return (
    <Route path="/admin" element={<AdminLayout />}>
      {/* Dashboard */}
      <Route path="dashboard" element={<Dashboard />} />

      {/* Products */}
      <Route path="products" element={<ProductManagement />} />
      <Route path="products/add" element={<ProductForm />} />
      <Route path="products/:id" element={<ProductForm />} />
      <Route path="products/:id/variant" element={<ProductVariantDetail />} />
      <Route path="products/stock" element={<StockManagement />} />

      {/* Orders */}
      <Route path="orders" element={<OrderManagement />} />
      <Route path="orders/:orderId" element={<OrderDetail />} />

      {/* Categories */}
      <Route path="categories" element={<CategoryManagement />} />

      {/* Users */}
      <Route path="users" element={<UserManagement />} />

      {/* Banners */}
      <Route path="banner" element={<BannerManagement />} />
      <Route path="banner/add" element={<BannerForm />} />
      <Route path="banner/edit/:id" element={<BannerForm />} />

      {/* Reviews & Support */}
      <Route path="reviews" element={<ReviewManagement />} />
      <Route path="support" element={<Support />} />

      {/* Fallback */}
      <Route path="*" element={<ErrorPage />} />
    </Route>
  );
}

export default AdminRoutes;
