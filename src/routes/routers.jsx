import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Home from "../pages/Home/Home";
import About from "../pages/FAQ/About";
import Devices from "../pages/Devices/Devices";
import Reports from "../pages/Reports/Reports";
import Schedule from "../pages/Schedule/Schedule";
import User from "../pages/Authentication/User";
import Admin from "../pages/Authentication/Admin";
import ConfigDevice from "../pages/Configdevice/ConfigDevice";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import { PERMISSIONS } from "../contexts/AuthContext";
import Unauthorized from "../pages/Authentication/Unauthorized";
import NotFound from "../pages/Authentication/NotFound";
import LandingPage from "../pages/LangdingPage/LandingPage";

import { AuthProvider, useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ requiredPermission }) => {
  const { currentUser, hasPermission, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg">Đang tải...</span>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login-as" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
const AuthLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};
const AdminOnlyRoute = () => {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg">Đang tải...</span>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login-as" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      // Các route công khai
      {
        path: "/login-as",
        element: <LandingPage />,
      },
      {
        path: "/login/:userType",
        element: <Login />,
      },
      {
        path: "/register",
        element: <SignUp />,
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },

      // Route bảo vệ - yêu cầu chỉ cần đăng nhập
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/about",
            element: <About />,
          },
          {
            path: "/account",
            element: <User />,
          },
          {
            path: "/devices",
            element: <Devices />,
          },
          // {
          //   path: "/reports",
          //   element: <Reports />,
          // },
          {
            path: "/schedule",
            element: <Schedule />,
          },
          {
            path: "/configdevice",
            element: <ConfigDevice />,
          },
        ],
      },

      {
        element: <AdminOnlyRoute />,
        children: [
          {
            path: "/admin",
            element: <Admin />,
          },
          // Có thể thêm các route admin khác ở đây
        ],
      },

      {
        path: "/login",
        element: <Navigate to="/login-as" replace />,
      },

      // Route không tìm thấy
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Home />,
//   },
//   {
//     path: "/about",
//     element: <About />,
//   },
//   {
//     path: "/devices",
//     element: <Devices />,
//   },
//   {
//     path: "/reports",
//     element: <Reports />,
//   },
//   {
//     path: "/schedule",
//     element: <Schedule />,
//   },
//   {
//     path: "/account",
//     element: <User />,
//   },
//   {
//     path: "/admin",
//     element: <Admin />,
//   },
//   {
//     path: "/configdevice",
//     element: <ConfigDevice />,
//   },
// ]);
