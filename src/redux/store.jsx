import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import sizeReducer from "./slices/sizeSlice";
import colorReducer from "./slices/colorSlice";
import productVariantReducer from "./slices/productVariantSlice";
import categoryReducer from "./slices/categorySlice";
import orderReducer from "./slices/orderSlice";
import bannerReducer from "./slices/bannerSlice";
import dashboardReducer from "./slices/dashboardSlice";

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    products: productReducer,
    size: sizeReducer,
    colors: colorReducer,
    productVariants: productVariantReducer,
    order: orderReducer,
    banner: bannerReducer,
    dashboard: dashboardReducer,
  },
});
