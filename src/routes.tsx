import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { Login } from "./pages/Auth/Login";
import { SignUp } from "./pages/Auth/SignUp";
import Dashboard from "./pages/Dashboard/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
    ],
  },
]);