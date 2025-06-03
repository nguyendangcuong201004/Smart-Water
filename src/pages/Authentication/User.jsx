import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import {
  useAuth,
  PermissionGate,
  PERMISSIONS,
} from "../../contexts/AuthContext";

const User = () => {
  const { currentUser, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (!currentUser && !isLoading) {
      navigate("/login");
      console.log(currentUser);
    }
  }, [currentUser, navigate, isLoading]);

  // Lấy thông tin người dùng từ AuthContext
  useEffect(() => {
    if (currentUser) {
      setUserInfo(currentUser);
    }
  }, [currentUser]);

  const showNotification = (message, type = "success") => {
    setNotification({
      show: true,
      message,
      type,
    });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const username = currentUser.username;
    console.log("Using username:", username);
    if (!username) {
      showNotification("Không tìm thấy username", "error");
      setIsLoading(false);
      return;
    }
    const updatedInfo = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      role: userInfo.role,
      address: e.target.address.value,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/auth/user/${encodeURIComponent(
          username
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedInfo),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setUserInfo(result.user || { ...userInfo, ...updatedInfo });
        showNotification("Cập nhật thành công!", "success");
      } else {
        console.error(result.message || "Cập nhật thất bại");
        showNotification(result.message || "Cập nhật thất bại");
        throw new Error(result.message || "Cập nhật thất bại");
      }
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra quyền
    if (!hasPermission(PERMISSIONS.EDIT_PROFILE)) {
      showNotification("Bạn không có quyền thay đổi ảnh đại diện", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:3000/api/v1/upload/image", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (res.ok) {
        const newImageUrl = result.imageUrl;
        // Cập nhật ảnh trong DB
        await fetch(
          `http://localhost:3000/api/v1/auth/user/${
            currentUser.name || currentUser.username
          }`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profileImage: newImageUrl }),
          }
        );

        setUserInfo({ ...userInfo, profileImage: newImageUrl });
        showNotification("Cập nhật ảnh thành công!", "success");
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      showNotification(err.message, "error");
    }
  };

  // Hiển thị role badge theo màu khác nhau
  const getRoleBadgeColor = (role) => {
    if (!role) return "bg-gray-200 text-gray-800";

    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const defaultUserInfo = {
    name: userInfo?.name || "Tên người dùng",
    email: userInfo?.email || "email@example.com",
    phone: userInfo?.phone || "Chưa cập nhật",
    role: userInfo?.role || "User",
    address: userInfo?.address || "Chưa cập nhật",
    username: userInfo?.username || "Chưa cập nhật",
    accountStatus: userInfo?.accountStatus || "Active",
    joinDate: userInfo?.joinDate || new Date().toISOString().split("T")[0],
    lastLogin: userInfo?.lastLogin || new Date().toLocaleString(),
    permissions: userInfo?.permissions || ["Dashboard", "Profile"],
    profileImage: userInfo?.profileImage || "https://via.placeholder.com/150",
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg">Đang tải thông tin người dùng...</span>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar className="w-1/6 min-h-screen bg-gray-800 text-white" />

      <div className="flex flex-col w-5/6 min-h-screen">
        <Header className="w-full bg-blue-500 text-white p-4 " />
        {notification.show && (
          <div
            className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {notification.message}
          </div>
        )}

        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h1 className="text-3xl font-bold text-gray-800 border-b pb-4 mb-6 flex items-center">
              Thông tin người dùng
              <span
                className={`ml-3 text-sm px-2 py-1 rounded-full ${getRoleBadgeColor(
                  defaultUserInfo.role
                )}`}
              >
                {defaultUserInfo.role}
              </span>
            </h1>

            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="relative mb-4 md:mb-0 md:mr-8">
                <img
                  src={defaultUserInfo.profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                />

                <PermissionGate permission={PERMISSIONS.EDIT_PROFILE}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="absolute bottom-0 right-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </label>
                </PermissionGate>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {defaultUserInfo.name}
                </h2>
                <p className="text-gray-600">
                  {defaultUserInfo.role} - {defaultUserInfo.username}
                </p>
                <div className="mt-2 flex items-center">
                  <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      defaultUserInfo.accountStatus === "Active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></span>
                  <span className="text-sm text-gray-600">
                    {defaultUserInfo.accountStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Hồ sơ người dùng */}
              <div className="p-6 border rounded-lg bg-white shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Hồ sơ người dùng
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Tên</p>
                    <p className="font-medium">{defaultUserInfo.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{defaultUserInfo.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{defaultUserInfo.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Vai trò</p>
                    <p className="font-medium">{defaultUserInfo.role}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Tên đăng nhập</p>
                    <p className="font-medium">{defaultUserInfo.username}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <p className="font-medium">{defaultUserInfo.address}</p>
                  </div>
                </div>

                {/* Chỉ hiển thị nút chỉnh sửa nếu có quyền */}
                <PermissionGate permission={PERMISSIONS.EDIT_PROFILE}>
                  <div className="mt-6 text-center">
                    <button
                      className="py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 flex items-center mx-auto"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Chỉnh sửa hồ sơ
                    </button>
                  </div>
                </PermissionGate>
              </div>

              {/* Hồ sơ hệ thống */}
              <div className="p-6 border rounded-lg bg-white shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Thông tin hệ thống
                </h2>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      Trạng thái tài khoản
                    </p>
                    <p className="font-medium flex items-center">
                      <span
                        className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          defaultUserInfo.accountStatus === "Active"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      {defaultUserInfo.accountStatus}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Ngày tham gia</p>
                    <p className="font-medium">{defaultUserInfo.joinDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Đăng nhập lần cuối</p>
                    <p className="font-medium">{defaultUserInfo.lastLogin}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Quyền hạn</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {defaultUserInfo.permissions.map((permission, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity section - chỉ hiển thị cho admin và manager */}
            <PermissionGate permission={PERMISSIONS.VIEW_REPORTS}>
              <div className="mt-8 p-6 border rounded-lg bg-white shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  Hoạt động gần đây
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Đăng nhập thành công</p>
                      <p className="text-sm text-gray-500">
                        {new Date().toLocaleString()} | IP: 192.168.1.1
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Cập nhật thông tin hồ sơ</p>
                      <p className="text-sm text-gray-500">
                        {new Date(Date.now() - 86400000).toLocaleString()}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </PermissionGate>

            {/* Chỉ hiển thị phần quản lý người dùng cho admin */}
            <PermissionGate permission={PERMISSIONS.MANAGE_USERS}>
              <div className="mt-8 p-6 border rounded-lg bg-white shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Quản lý người dùng
                </h2>
                <div className="text-center py-4">
                  <button
                    className="py-2 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                    onClick={() => navigate("/admin")}
                  >
                    Quản lý danh sách người dùng
                  </button>
                </div>
              </div>
            </PermissionGate>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
              <div className="bg-white p-8 rounded-lg w-full max-w-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Chỉnh sửa hồ sơ
                </h2>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên
                      </label>
                      <input
                        name="name"
                        defaultValue={defaultUserInfo.name}
                        placeholder="Tên"
                        className="border p-2 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        name="email"
                        defaultValue={defaultUserInfo.email}
                        placeholder="Email"
                        className="border p-2 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SĐT
                      </label>
                      <input
                        name="phone"
                        defaultValue={defaultUserInfo.phone}
                        placeholder="SĐT"
                        className="border p-2 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ
                      </label>
                      <input
                        name="address"
                        defaultValue={defaultUserInfo.address}
                        placeholder="Địa chỉ"
                        className="border p-2 rounded w-full"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>

        <div className="mt-auto">
          <Footer className="w-full bg-gray-800 text-white text-center p-4" />
        </div>
      </div>
    </div>
  );
};

export default User;
