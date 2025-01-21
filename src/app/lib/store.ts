import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "@/app/lib/features/todos/cartSlice"; // Import cartReducer

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer, // Add the cart reducer
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
