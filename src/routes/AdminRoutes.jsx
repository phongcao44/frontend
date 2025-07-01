// import React from "react";

import { Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ErrorPage from "../pages/ErrorPage";
import ProductManagement from "../pages/admin/ProductManagement";
import OrderManagement from "../pages/admin/OrderManagement";
import CategoryManagement from "../pages/admin/CategoryManagement";
import UserManagement from "../pages/admin/UserManagement";
import Dashboard from "../pages/admin/Dashboard";
import StockManagement from "../pages/admin/StockManagement";
import BannerManagement from "../pages/admin/BannerManagement";
import ReviewManagement from "../pages/admin/ReviewManagement";
import Support from "../pages/admin/Support";
import ProductForm from "../components/product/ProductForm";
import ProductVariantDetail from "../components/product/ProductVariantDetail";

function AdminRoutes() {
  return (
    <Route path="/admin" element={<AdminLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="products" element={<ProductManagement />} />
      <Route path="products/:id" element={<ProductForm />} />

      <Route path="products/:id/variant" element={<ProductVariantDetail />} />

      <Route path="products/add" element={<ProductForm />} />
      {/* <Route path="products/new" element={<ProductForm />} /> */}
      <Route path="products/stock" element={<StockManagement />} />
      <Route path="orders" element={<OrderManagement />} />
      {/* <Route path="orders/:id" element={<OrderDetail />} /> */}
      <Route path="categories" element={<CategoryManagement />} />
      <Route path="accounts" element={<UserManagement />} />
      {/* <Route path="accounts/new" element={<AccountForm />} /> */}
      <Route path="banners" element={<BannerManagement />} />
      <Route path="reviews" element={<ReviewManagement />} />

      <Route path="support" element={<Support />} />
      <Route path="*" element={<ErrorPage />} />
    </Route>
  );
}

export default AdminRoutes;
