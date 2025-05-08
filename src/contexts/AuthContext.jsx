// contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Thêm import axios

// Tạo context cho authentication và authorization
export const AuthContext = createContext();

export const PERMISSIONS = {
  VIEW_DASHBOARD: "view_dashboard",
  VIEW_REPORTS: "view_reports",
  EDIT_PROFILE: "edit_profile",
  MANAGE_DEVICES: "manage_devices",
  CONFIGURE_DEVICES: "configure_devices",
  VIEW_SETTINGS: "view_settings",
  MANAGE_SCHEDULES: "manage_schedules",

  // Quyền chỉ dành cho admin
  ADMIN_ACCESS: "admin_access",
  MANAGE_USERS: "manage_users",
};

// Định nghĩa roles với permissions tương ứng
export const ROLES = {
  ADMIN: [
    // Tất cả các quyền của user
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.MANAGE_DEVICES,
    PERMISSIONS.CONFIGURE_DEVICES,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.MANAGE_SCHEDULES,

    // Quyền đặc biệt của admin
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.MANAGE_USERS,
  ],

  CUSTOMER: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.MANAGE_DEVICES,
    PERMISSIONS.CONFIGURE_DEVICES,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.MANAGE_SCHEDULES,
  ],
};

const api = axios.create({
  baseURL: "https://smart-water-server.vercel.app/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [userType, setUserType] = useState("customer");
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    const checkLoggedInUser = async () => {
      try {
        const username = getCookie("user_name");

        if (username) {
          try {
            const response = await api.get(`/auth/user/${username}`);
            const userData = response.data;

            setCurrentUser(userData);
            const role = userData.role;
            setUserType(role);

            if (role === "admin") {
              setUserPermissions(ROLES.ADMIN);
            } else {
              setUserPermissions(ROLES.CUSTOMER);
            }
          } catch (error) {
            if (error.response && error.response.status === 401) {
              clearAuthCookies();
            }
            console.error("Error fetching user data:", error);
          }
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        clearAuthCookies();
      } finally {
        setLoading(false);
      }
    };

    checkLoggedInUser();
  }, []);
  const fetchUsers = async () => {
    try {
      // Ensure there's a valid token in headers
      const token = localStorage.getItem("auth_token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await api.get("/auth/user");
        setUsers(response.data);
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const deleteUser = async (username) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        return { success: false, message: "Không có token xác thực" };
      }
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      console.log(`Đang gọi API xóa user: /auth/user/${username}`);
      const response = await api.delete(`/auth/user/${username}`);

      if (response.data) {
        console.log("Kết quả xóa user:", response.data);
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.username !== username)
        );
        return { success: true, message: "Xóa người dùng thành công" };
      }

      return { success: false, message: "Không thể xóa người dùng" };
    } catch (error) {
      // console.error("Chi tiết lỗi xóa user:", error);
      // console.log("Status code:", error.response?.status);
      // console.log("Response data:", error.response?.data);

      // Thông báo lỗi cụ thể hơn

      return {
        success: false,
        message: error.response?.data?.message || "Xóa người dùng thất bại",
      };
    }
  };
  useEffect(() => {
    if (currentUser && isAdmin()) {
      fetchUsers();
    }
  }, [currentUser]);
  // Hàm login
  const login = async (username, password, userType = "customer") => {
    try {
      const loginUrl =
        userType === "admin" ? "/auth/admin/login" : "/auth/login";

      const response = await api.post(loginUrl, { username, password });
      const result = response.data;
      if (result.token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${result.token}`;
        localStorage.setItem("auth_token", result.token); // optional
      }

      document.cookie = `user_name=${username}; path=/`;
      document.cookie = `user_type=${userType}; path=/`;

      setUserType(userType);

      const userApiUrl =
        userType === "admin"
          ? `/auth/admin/${username}`
          : `/auth/user/${username}`;

      // Chuyển sang axios
      const userResponse = await api.get(userApiUrl);
      const userData = userResponse.data;

      setCurrentUser(userData);
      setUserPermissions(userType === "admin" ? ROLES.ADMIN : ROLES.CUSTOMER);
      setAuthError("");

      if (userType === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      return { success: true, message: "Đăng nhập thành công!" };
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage =
        error.response?.data?.message || "Đăng nhập thất bại";
      setAuthError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", {
        username: userData.username,
        password: userData.password,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        birth: userData.birth,
        role: userData.role || "customer",
      });

      const result = response.data;
      setAuthError("");
      return { success: true, message: "Đăng ký thành công!" };
    } catch (error) {
      const errorMessager = error.response?.data?.message || "Đăng ký thất bại";
      setAuthError(errorMessager);
      return { success: false, message: errorMessager };
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    delete api.defaults.headers.common["Authorization"];
    clearAuthCookies();
    setCurrentUser(null);
    setUserPermissions([]);
    setUserType(null);
    navigate("/login-as");
  };

  const clearAuthCookies = () => {
    document.cookie =
      "user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "user_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const hasPermission = (permission) => {
    return userPermissions && userPermissions.includes(permission);
  };

  // Hàm kiểm tra có phải admin không
  const isAdmin = () => {
    return userType === "admin";
  };

  // Helper function để lấy cookie
  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (match) return match[2];
    return null;
  };

  const value = {
    currentUser,
    userType,
    isAdmin,
    login,
    register,
    logout,
    hasPermission,
    PERMISSIONS,
    loading,
    authError,
    setAuthError,
    users,
    fetchUsers,
    deleteUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook để sử dụng Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const PermissionGate = ({ children, permission }) => {
  const { hasPermission, loading } = useAuth();
  if (loading) {
    return null;
  }
  if (!permission || (hasPermission && hasPermission(permission))) {
    return children;
  }

  return null;
};

// AdminGate component - chỉ hiển thị nội dung khi là admin
export const AdminGate = ({ children }) => {
  const { isAdmin } = useAuth();

  if (isAdmin()) {
    return children;
  }

  return null;
};
