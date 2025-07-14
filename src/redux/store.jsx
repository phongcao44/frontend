import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import sizeReducer from "./slices/sizeSlice";
import colorReducer from "./slices/colorSlice";
import productVariantReducer from "./slices/productVariantSlice";
import categoryReducer from "./slices/categorySlice";
import orderReducer from "./slices/orderSlice";
import bannerReducer from "./slices/bannerSlice";
import userReducer from "./slices/userSlice";
import flashSaleReducer from "./slices/flashSaleSlice";
import postReducer from "./slices/postSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import dashboardReducer from "./slices/dashboardSlice";
import addressReducer from "./slices/addressSlice";
import productImageReducer from "./slices/productImageSlice";
import reviewReducer from "./slices/reviewSlice";
import returnRequestReducer from "./slices/returnRequestSlice";

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    products: productReducer,
    size: sizeReducer,
    colors: colorReducer,
    productVariants: productVariantReducer,
    order: orderReducer,
    banner: bannerReducer,
    users: userReducer,
    flashSale: flashSaleReducer,
    posts: postReducer,
    auth: authReducer,
    cart: cartReducer,
    dashboard: dashboardReducer,
    address: addressReducer,
    productImage: productImageReducer,
    review: reviewReducer,
    returnRequest: returnRequestReducer,
  },
});
