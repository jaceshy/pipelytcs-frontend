import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Dashboard/Dashboard";
import SalesInsights from "./pages/SalesInsights/SalesInsights";
import AddPurchase from "./pages/SalesInsights/AddPurchase";
import AdminLayout from "./layouts/AdminLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },

      {
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "sales-insights", element: <SalesInsights /> },
        ],
      },

      {
        path: "sales-insights/add-purchase",
        element: <AddPurchase />,
      },
    ],
  },
]);