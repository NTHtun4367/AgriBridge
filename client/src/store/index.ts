import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/api";
import authReducer, { type AuthState } from "./slices/auth";
import themeReducer from "./slices/theme";
import settingsReducer, { type SettingsState } from "./slices/settings";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const authPersistConfig = {
  key: "auth",
  storage,
};

const settingsPersistConfig = {
  key: "settings",
  storage,
};

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: persistReducer<AuthState>(authPersistConfig, authReducer),
    settings: persistReducer<SettingsState>(
      settingsPersistConfig,
      settingsReducer,
    ),
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  // Vite အတွက် devTools အမှန်ပြင်ဆင်ချက်
  devTools: import.meta.env.MODE !== "production",
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
