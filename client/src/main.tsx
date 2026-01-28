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
import IsVerified from "./pages/protector/IsVerified.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import Farmer from "./pages/admin/Farmer.tsx";
import Merchant from "./pages/admin/Merchant.tsx";
import { PersistGate } from "redux-persist/integration/react";
import Verification from "./pages/admin/Verification.tsx";
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
import EntryDetailPage from "./components/EntryDetailPage.tsx";
import MarketManagement from "./pages/admin/MarketManagement.tsx";
import MerchantMarketManagement from "./pages/merchant/MerchantMarketManagement.tsx";
import Announcement from "./pages/admin/Announcement.tsx";
import MerchantProfile from "./pages/farmer/MerchantProfile.tsx";
import CropPriceHistoryLanding from "./pages/landing/CropPriceHistoryLanding.tsx";
import CropPriceHistoryDashboard from "./pages/farmer/CropPriceHistoryDashboard.tsx";
import PreorderList from "./pages/farmer/PreorderList.tsx";
import { MerchantOrderList } from "./pages/merchant/MerchantOrderList.tsx";
import { Notification } from "./pages/Notification.tsx";
import InvoiceList from "./pages/farmer/InvoiceList.tsx";
import MerchantInvoices from "./pages/merchant/MerchantInvoices.tsx";
import MerchantInvoiceCreate from "./pages/merchant/MerchantInvoiceCreate.tsx";
import CropManagement from "./pages/admin/CropManagement.tsx";
import MarketPlaceManagement from "./pages/admin/MarketLocationManagement.tsx";
import Settings from "./pages/Settings.tsx";
import Dispute from "./pages/admin/Dispute.tsx";
import FarmerDisputes from "./pages/farmer/Disputes.tsx";
import Profile from "./pages/Profile.tsx";
import VerifyOtp from "./pages/VerifyOtp.tsx";
import PendingApproval from "./pages/landing/PendingApproval.tsx";
import MerchantRecords from "./pages/merchant/MerchantRecords.tsx";
import About from "./pages/landing/About.tsx";
import Contact from "./pages/landing/Contact.tsx";
import PrivacyPolicy from "./pages/landing/PrivacyPolicy.tsx";
import MerchantLanding from "./pages/landing/MerchantLanding.tsx";
import Report from "./pages/farmer/Report.tsx";
import CategoryDashboard from "./pages/merchant/CategoryDashboard.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      { index: true, element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/verify-otp", element: <VerifyOtp /> },
      { path: "/pending-approval", element: <PendingApproval /> },
      { path: "/markets", element: <MarketPriceLanding /> },
      { path: "/farmers-landing", element: <FarmerLanding /> },
      { path: "/merchants-landing", element: <MerchantLanding /> },
      { path: "/crop-price-history", element: <CropPriceHistoryLanding /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      {
        path: "/farmer",
        element: <FarmerPanel />,
        children: [
          { path: "/farmer/dashboard", element: <FarmerDashboard /> },
          { path: "/farmer/markets", element: <MarketDashboard /> },
          { path: "/farmer/merchants", element: <MerchantsView /> },
          { path: "/farmer/merchants/:userId", element: <MerchantProfile /> },
          { path: "/farmer/records", element: <Records /> },
          { path: "/farmer/records/:id", element: <EntryDetailPage /> },
          { path: "/farmer/preorders", element: <PreorderList /> },
          { path: "/farmer/invoices", element: <InvoiceList /> },
          { path: "/farmer/notifications", element: <Notification /> },
          {
            path: "/farmer/crop-price-history",
            element: <CropPriceHistoryDashboard />,
          },
          { path: "/farmer/disputes", element: <FarmerDisputes /> },
          { path: "/farmer/settings", element: <Settings /> },
          { path: "/farmer/profile", element: <Profile /> },
          { path: "/farmer/reports", element: <Report /> },
        ],
      },
      {
        path: "/merchant",
        element: <MerchantPanel />,
        children: [
          // PUBLIC MERCHANT ROUTES
          { path: "/merchant/dashboard", element: <MerchantDashboard /> },
          { path: "/merchant/markets", element: <MarketDashboard /> },
          {
            path: "/merchant/crop-price-history",
            element: <CropPriceHistoryDashboard />,
          },
          { path: "/merchant/notifications", element: <Notification /> },
          { path: "/merchant/settings", element: <Settings /> },
          { path: "/merchant/profile", element: <Profile /> },

          // PROTECTED MERCHANT ROUTES (Verified Only)
          {
            element: <IsVerified />,
            children: [
              {
                path: "/merchant/manage-market",
                element: <MerchantMarketManagement />,
              },
              { path: "/merchant/records", element: <MerchantRecords /> },
              { path: "/merchant/preorders", element: <MerchantOrderList /> },
              { path: "/merchant/records/:id", element: <EntryDetailPage /> },
              { path: "/merchant/invoices", element: <MerchantInvoices /> },
              { path: "/merchant/analytics", element: <CategoryDashboard /> },
              {
                path: "/merchant/invoices/create",
                element: <MerchantInvoiceCreate />,
              },
            ],
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
          { path: "/admin/dashboard", element: <Dashboard /> },
          { path: "/admin/manage-farmers", element: <Farmer /> },
          { path: "/admin/manage-merchants", element: <Merchant /> },
          { path: "/admin/verification", element: <Verification /> },
          { path: "/admin/manage-market", element: <MarketManagement /> },
          { path: "/admin/manage-market/crops", element: <CropManagement /> },
          {
            path: "/admin/manage-market/markets",
            element: <MarketPlaceManagement />,
          },
          {
            path: "/admin/manage-market/prices",
            element: <MarketManagement />,
          },
          { path: "/admin/announcements", element: <Announcement /> },
          { path: "/admin/disputes", element: <Dispute /> },
          { path: "/admin/settings", element: <Settings /> },
          { path: "/admin/notifications", element: <Notification /> },
          { path: "/admin/profile", element: <Profile /> },
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
  </StrictMode>,
);
