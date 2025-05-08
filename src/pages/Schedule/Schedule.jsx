import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import { ScheduleProvider, useSchedule } from "../../contexts/ScheduleContext";
import { FcAbout } from "react-icons/fc";
import { FcFullTrash } from "react-icons/fc";
const ScheduleContent = () => {
  const {
    events,
    history,
    loading,
    addSchedule,
    deleteSchedule,
    updateSchedule,
  } = useSchedule();
  // console.log("events", events);
  // console.log("history", history);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: "", datetime: "" });

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const form = e.target;

    const datetime = new Date(form.datetime.value);
    const newEvent = {
      title: form.title.value,
      date: datetime.toISOString(),
    };

    const result = isEditing
      ? await updateSchedule(editingId, newEvent) // Cập nhật sự kiện
      : await addSchedule(newEvent); // Thêm sự kiện mới

    if (result.success) {
      alert(
        isEditing ? "✏️ Sự kiện đã được cập nhật!" : "📝 Sự kiện đã được thêm!"
      );
      form.reset();
      setFormData({ title: "", datetime: "" });
      setIsEditing(false);
      setEditingId(null);
    } else {
      alert(`❌ Error: ${result.message}`);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm xóa sự kiện
  const handleDeleteEvent = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá sự kiện này không?")) {
      const result = await deleteSchedule(id);
      if (result.success) {
        alert("🗑️ Đã xoá sự kiện!");
      } else {
        alert(`❌ Lỗi khi xoá: ${result.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        <span className="ml-4 text-xl font-medium text-gray-600">
          Loading schedules...
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-emerald-50">
      <Sidebar className="w-1/6 min-h-screen bg-gray-800 text-white" />
      <div className="flex flex-col w-5/6">
        <Header />
        <main className="flex-grow px-8 py-6">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Lịch tưới cây
            </h1>
            <p className="text-gray-500">
              Quản lý các sự kiện và lịch sử tưới cây của bạn
            </p>
          </div>

          {/* Form */}
          <div className="grid md:grid-cols-2 gap-8 mt-10">
            <div className="bg-white shadow-md rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                ➕ Thêm sự kiện mới
              </h2>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Tên sự kiện"
                  required
                />
                <input
                  type="datetime-local"
                  name="datetime"
                  value={formData.datetime}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-medium py-2 rounded-lg"
                >
                  {isEditing ? "Cập nhật sự kiện" : "Thêm sự kiện"}
                </button>
              </form>
            </div>

            {/* Lịch tưới - hiển thị ngay bên cạnh */}
            <div className="bg-white shadow-md rounded-2xl p-6 overflow-x-auto">
              <h2 className="text-2xl font-bold mb-4">📅 Danh sách sự kiện</h2>
              <table className="w-full text-left border-collapse">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="p-3 border-b">Tên sự kiện</th>
                    <th className="p-3 border-b">Ngày tưới</th>
                    <th className="p-3 border-b">Thời gian</th>
                    <th className="p-3 border-b">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr
                      key={index}
                      className="odd:bg-white even:bg-gray-50 transition hover:bg-blue-50"
                    >
                      <td className="p-3">{event.name}</td>
                      <td className="p-3">
                        {new Date(event.date).toLocaleDateString("vi-VN", {
                          timeZone: "Asia/Ho_Chi_Minh",
                        })}
                      </td>
                      <td className="p-3">
                        {new Date(event.date).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "Asia/Ho_Chi_Minh",
                        })}
                      </td>
                      <td className="p-3">
                        {/* Chỉnh sửa sự kiện */}
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setEditingId(event._id);
                            setFormData({
                              title: event.title,
                              datetime: new Date(event.date)
                                .toISOString()
                                .slice(0, 16),
                            });
                          }}
                          className="mx-2.5 hover:cursor-pointer"
                        >
                          <FcAbout className="w-4 h-4" />
                        </button>
                        {/* Xóa sự kiện */}
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="mx-2.5 hover:cursor-pointer"
                        >
                          <FcFullTrash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* History */}
          <div className="mt-10 bg-white shadow-md rounded-2xl p-6 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">📊 Lịch sử tưới</h2>
            <table className="w-full text-left border-collapse">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="p-3 border-b">Ngày</th>
                  <th className="p-3 border-b">Thời gian</th>
                  <th className="p-3 border-b">Độ ẩm</th>
                  <th className="p-3 border-b">Nhiệt độ</th>
                </tr>
              </thead>
              <tbody>
                {/* {console.log("history", history)} */}
                {history.map((h, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white even:bg-gray-50 transition hover:bg-yellow-50"
                  >
                    <td className="p-3">{h.date}</td>
                    <td className="p-3">{h.time}</td>
                    <td className="p-3">{h.moisture}%</td>
                    <td className="p-3">{h.temperature}°C</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

const Schedule = () => (
  <ScheduleProvider>
    <ScheduleContent />
  </ScheduleProvider>
);

export default Schedule;
