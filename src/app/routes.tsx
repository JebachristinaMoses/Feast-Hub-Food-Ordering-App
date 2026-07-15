import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { CustomerLoginPage } from "./pages/CustomerLoginPage";
import { AdminRegisterPage } from "./pages/AdminRegisterPage";
import { CustomerRegisterPage } from "./pages/CustomerRegisterPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin/register",
    element: <AdminRegisterPage />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/customer/login",
    element: <CustomerLoginPage />,
  },
  {
    path: "/customer/register",
    element: <CustomerRegisterPage />,
  },
  {
    path: "/customer/dashboard",
    element: <CustomerDashboard />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
