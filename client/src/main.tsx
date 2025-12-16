import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Main from "./layouts/Main.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import { Provider } from "react-redux";
import { persistor, store } from "./store/index.ts";
import Panel from "./pages/admin/Panel.tsx";
import IsAdmin from "./pages/protector/IsAdmin.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import Farmer from "./pages/admin/Farmer.tsx";
import Merchant from "./pages/admin/Merchant.tsx";
import { PersistGate } from "redux-persist/integration/react";
import Verification from "./pages/admin/Verification.tsx";
import VerificationSubmitted from "./pages/VerificationSubmitted.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/verification-submitted",
        element: <VerificationSubmitted />,
      },
      {
        path: "/admin",
        element: (
          <IsAdmin>
            <Panel />
          </IsAdmin>
        ),
        children: [
          {
            path: "/admin/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/admin/manage-farmers",
            element: <Farmer />,
          },
          {
            path: "/admin/manage-merchants",
            element: <Merchant />,
          },
          {
            path: "/admin/verification",
            element: <Verification />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);
