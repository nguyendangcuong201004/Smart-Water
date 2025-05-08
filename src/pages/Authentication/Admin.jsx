import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { isAdmin, users, fetchUsers, deleteUser } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/unauthorized");
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      const { success, data } = await fetchUsers();
      if (success) {
        console.log("Users loaded:", data);
        setIsLoading(false);
      } else {
        setError("Failed to load users");
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      const userToDelete = users.find((user) => user._id === userId);
      if (!userToDelete) {
        setError("Không tìm thấy người dùng cần xóa");
        return;
      }

      try {
        setIsLoading(true);
        const result = await deleteUser(userToDelete.username);
        if (result.success) {
          alert("Xóa người dùng thành công");
          await fetchUsers();
          setIsLoading(false);
        } else {
          setError(result.message || "Xóa người dùng thất bại");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Delete user error:", error);
        setError("Có lỗi xảy ra khi xóa người dùng");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-1/6 min-h-screen bg-gray-800 text-white" />
      <div className="flex flex-col w-5/6">
        <Header className="w-full bg-blue-600 text-white p-4 shadow-md" />

        <main className="flex-grow container mx-auto py-8 px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              Quản lý người dùng
            </h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded relative">
              <strong className="font-bold">Lỗi: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              Không có người dùng nào.
            </div>
          ) : (
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-center">#</th>
                    <th className="px-6 py-3">Tên</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Vai trò</th>
                    <th className="px-6 py-3 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user._id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-center">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.role || "N/A"}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-200"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        <Footer className="w-full bg-gray-100 text-gray-500 text-center py-4" />
      </div>
    </div>
  );
};

export default Admin;
