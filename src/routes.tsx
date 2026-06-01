import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import App from "./App";
import { useAuth } from "./context/AuthContext";

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

type Role = "admin" | "team";

const getDashboardPath = (role?: Role) => {
  return role === "admin" ? "/dashboard" : "/team/dashboard";
};

const HomeRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDashboardPath(user.role)} replace />;
};

const PublicOnlyRoute = () => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Outlet />;
};

const ProtectedRoute = ({ role }: { role: Role }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Outlet />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomeRedirect />,
      },

      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "signup",
            element: <SignUp />,
          },
        ],
      },

      {
        element: <ProtectedRoute role="admin" />,
        children: [
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
            path: "sales-insights/add-purchase",
            element: <AddPurchase />,
          },
          {
            path: "product-analytics/add-product",
            element: <AddProduct />,
          },
        ],
      },

      {
        element: <ProtectedRoute role="team" />,
        children: [
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
        ],
      },
    ],
  },
]);