import { configureStore } from "@reduxjs/toolkit";
import { setUnauthorizedHandler } from "../api/tokenManager";
import authReducer from "../features/auth/slice";
import { logout } from "../features/auth/thunks";
import dashboardReducer from "../features/dashboard/slice";
import framesReducer from "../features/frames/slice";
import ordersReducer from "../features/orders/slice";
import toastReducer from "../features/toast/slice";
import usersReducer from "../features/users/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    users: usersReducer,
    orders: ordersReducer,
    frames: framesReducer,
    toast: toastReducer,
  },
  // Admin pages hold customer emails, phones and addresses — keep them out of
  // Redux DevTools in production.
  devTools: import.meta.env.DEV,
});

// An expired/invalid session on any request logs the user out everywhere.
setUnauthorizedHandler(() => {
  store.dispatch(logout());
});
