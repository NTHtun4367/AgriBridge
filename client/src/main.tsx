import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Main from "./layouts/Main.tsx";
import Home from "./pages/landing/Home.tsx";
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
import VerificationSubmitted from "./pages/landing/VerificationSubmitted.tsx";
import FarmerPanel from "./pages/farmer/FarmerPanel.tsx";
import FarmerDashboard from "./pages/farmer/FarmerDashboard.tsx";
import MerchantsView from "./pages/farmer/MerchantView.tsx";
import { useSelector } from "react-redux";
import type { RootState } from "./store/index.ts";
import MerchantPanel from "./pages/merchant/MerchantPanel.tsx";
import MerchantDashboard from "./pages/merchant/MerchantDashboard.tsx";
import MarketDashboard from "./pages/market/MarketDashboard.tsx";
import MarketPriceLanding from "./pages/landing/MarketPriceLanding.tsx";
import FarmerLanding from "./pages/landing/FarmerLanding.tsx";
import Records from "./pages/farmer/Records.tsx";
import EntryDetailPage from "./pages/farmer/EntryDetailPage.tsx";
import MarketManagement from "./pages/admin/MarketManagement.tsx";
import MerchantMarketManagement from "./pages/merchant/MerchantMarketManagement.tsx";
import Announcement from "./pages/admin/Announcement.tsx";
import MerchantProfile from "./pages/farmer/MerchantProfile.tsx";
import CropPriceHistoryLanding from "./pages/landing/CropPriceHistoryLanding.tsx";
import CropPriceHistoryDashboard from "./pages/farmer/CropPriceHistoryDashboard.tsx";
import PreorderList from "./pages/farmer/PreorderList.tsx";
import { MerchantOrderList } from "./pages/merchant/MerchantOrderList.tsx";
import { Notification } from "./pages/farmer/Notification.tsx";
import InvoiceList from "./pages/farmer/InvoiceList.tsx";
import MerchantInvoices from "./pages/merchant/MerchantInvoices.tsx";
import MerchantInvoiceCreate from "./pages/merchant/MerchantInvoiceCreate.tsx";
import CropManagement from "./pages/admin/CropManagement.tsx";
import MarketPlaceManagement from "./pages/admin/MarketLocationManagement.tsx";

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
        path: "/markets",
        element: <MarketPriceLanding />,
      },
      {
        path: "/farmers-landing",
        element: <FarmerLanding />,
      },
      {
        path: "/crop-price-history",
        element: <CropPriceHistoryLanding />,
      },
      {
        path: "/farmer",
        element: <FarmerPanel />,
        children: [
          {
            path: "/farmer/dashboard",
            element: <FarmerDashboard />,
          },
          {
            path: "/farmer/markets",
            element: <MarketDashboard />,
          },
          {
            path: "/farmer/merchants",
            element: <MerchantsView />,
          },
          {
            path: "/farmer/merchants/:userId",
            element: <MerchantProfile />,
          },
          {
            path: "/farmer/records",
            element: <Records />,
          },
          {
            path: "/farmer/records/:id",
            element: <EntryDetailPage />,
          },
          {
            path: "/farmer/preorders",
            element: <PreorderList />,
          },
          {
            path: "/farmer/invoices",
            element: <InvoiceList />,
          },
          {
            path: "/farmer/notifications",
            element: <Notification />,
          },
          {
            path: "/farmer/crop-price-history",
            element: <CropPriceHistoryDashboard />,
          },
        ],
      },
      {
        path: "/merchant",
        element: <MerchantPanel />,
        children: [
          {
            path: "/merchant/dashboard",
            element: <MerchantDashboard />,
          },
          {
            path: "/merchant/markets",
            element: <MarketDashboard />,
          },
          {
            path: "/merchant/crop-price-history",
            element: <CropPriceHistoryDashboard />,
          },
          {
            path: "/merchant/manage-market",
            element: <MerchantMarketManagement />,
          },
          {
            path: "/merchant/preorders",
            element: <MerchantOrderList />,
          },
          {
            path: "/merchant/invoices",
            element: <MerchantInvoices />,
          },
          {
            path: "/merchant/invoices/create",
            element: <MerchantInvoiceCreate />,
          },
          {
            path: "/merchant/notifications",
            element: <Notification />,
          },
        ],
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
          {
            path: "/admin/manage-market",
            element: <MarketManagement />,
          },
          {
            path: "/admin/manage-market/crops",
            element: <CropManagement />,
          },
          {
            path: "/admin/manage-market/markets",
            element: <MarketPlaceManagement />,
          },
          {
            path: "/admin/manage-market/prices",
            element: <MarketManagement />,
          },
          {
            path: "/admin/announcements",
            element: <Announcement />,
          },
        ],
      },
    ],
  },
]);

function ThemeWatcher() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mode]);
  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeWatcher />
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);
