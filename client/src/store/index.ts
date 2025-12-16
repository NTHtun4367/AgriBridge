import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/api";
import authReducer, { type AuthState } from "./slices/auth";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const authPersistConfig = {
  key: "auth",
  storage,
};

export const store = configureStore({
  reducer: {
    auth: persistReducer<AuthState>(authPersistConfig, authReducer),
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
