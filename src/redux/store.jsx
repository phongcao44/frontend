import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import sizeReducer from "./slices/sizeSlice";
import colorReducer from "./slices/colorSlice";
import productVariantReducer from "./slices/productVariantSlice";
import categoryReducer from "./slices/categorySlice";

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    products: productReducer,
    size: sizeReducer,
    colors: colorReducer,
    productVariants: productVariantReducer,
  },
});
