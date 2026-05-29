import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

import AdminLayout from "./layouts/AdminLayout";
import TeamLayout from "./layouts/TeamLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import SalesInsights from "./pages/SalesInsights/SalesInsights";
import AddPurchase from "./pages/SalesInsights/AddPurchase";
import PlatformComparison from "./pages/PlatformComparison/PlatformComparison";
import ProductAnalytics from "./pages/ProductAnalytics/ProductAnalytics";
import AddProduct from "./pages/ProductAnalytics/AddProduct";
import Settings from "./pages/Settings/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },

      {
        element: <AdminLayout />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "sales-insights",
            element: <SalesInsights />,
          },
          {
            path: "platform-comparison",
            element: <PlatformComparison />,
          },
          {
            path: "product-analytics",
            element: <ProductAnalytics />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },

      {
        element: <TeamLayout />,
        children: [
          {
            path: "team/dashboard",
            element: <Dashboard />,
          },
          {
            path: "team/sales-insights",
            element: <SalesInsights mode="team" />,
          },
          {
            path: "team/platform-comparison",
            element: <PlatformComparison />,
          },
          {
            path: "team/product-analytics",
            element: <ProductAnalytics mode="team" />,
          },
          {
            path: "team/settings",
            element: <Settings />,
          },
        ],
      },

      {
        path: "sales-insights/add-purchase",
        element: <AddPurchase />,
      },
      {
        path: "product-analytics/add-product",
        element: <AddProduct />,
      },
    ],
  },
]);