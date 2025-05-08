import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import ReportsCard from "./ReportsCards";
import Graph from "../../components/Graph";

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  // Dữ liệu báo cáo mẫu được mở rộng
  const reportData = [
    {
      id: "001",
      name: "Báo cáo nhiệt độ",
      status: "Hoàn thành",
      value: "28°C",
      date: "2025-04-01",
      type: "temperature",
      description: "Báo cáo về nhiệt độ trung bình trong tháng 4",
      author: "Nguyễn Văn A",
    },
    {
      id: "002",
      name: "Báo cáo độ ẩm không khí",
      status: "Đang tiến hành",
      value: "65%",
      date: "2025-04-02",
      type: "humidity",
      description: "Phân tích độ ẩm không khí trong khu vực nhà kính",
      author: "Trần Thị B",
    },
    {
      id: "003",
      name: "Báo cáo độ ẩm đất",
      status: "Chưa bắt đầu",
      value: "42%",
      date: "2025-04-03",
      type: "soil",
      description: "Đánh giá mức độ ẩm của đất trong các khu vực canh tác",
      author: "Lê Văn C",
    },
    {
      id: "004",
      name: "Báo cáo ánh sáng",
      status: "Hoàn thành",
      value: "850 lux",
      date: "2025-04-05",
      type: "light",
      description:
        "Phân tích cường độ ánh sáng tác động đến quá trình sinh trưởng",
      author: "Phạm Thị D",
    },
    {
      id: "005",
      name: "Báo cáo tổng hợp",
      status: "Đang tiến hành",
      value: "N/A",
      date: "2025-04-10",
      type: "summary",
      description:
        "Tổng hợp các thông số môi trường và đề xuất giải pháp tối ưu",
      author: "Hoàng Văn E",
    },
  ];

  // Xử lý lọc báo cáo theo trạng thái
  const getFilteredReports = () => {
    return reportData
      .filter((report) => {
        // Lọc theo trạng thái
        if (filterStatus !== "all" && report.status !== filterStatus) {
          return false;
        }

        // Lọc theo từ khóa tìm kiếm
        if (
          searchTerm &&
          !report.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !report.id.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sắp xếp theo trường được chọn
        if (a[sortField] < b[sortField]) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (a[sortField] > b[sortField]) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
  };

  // Xử lý click vào header để sắp xếp
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRowClick = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Hoàn thành":
        return (
          <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
        );
      case "Đang tiến hành":
        return (
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
        );
      case "Chưa bắt đầu":
        return (
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
        );
      default:
        return null;
    }
  };

  const getRowBackground = (type) => {
    switch (type) {
      case "temperature":
        return "hover:bg-red-50";
      case "humidity":
        return "hover:bg-blue-50";
      case "soil":
        return "hover:bg-green-50";
      case "light":
        return "hover:bg-yellow-50";
      default:
        return "hover:bg-gray-50";
    }
  };

  const filteredReports = getFilteredReports();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar className="w-1/6 min-h-screen bg-gray-800 text-white" />
      <div className="flex flex-col w-5/6">
        <Header className="w-full bg-blue-600 text-white p-4 shadow-md" />
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Danh sách báo cáo
              </h2>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm báo cáo..."
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Bộ lọc trạng thái */}
                <select
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Đang tiến hành">Đang tiến hành</option>
                  <option value="Chưa bắt đầu">Chưa bắt đầu</option>
                </select>

                {/* Nút tạo báo cáo mới */}
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Tạo báo cáo mới
                </button>
              </div>
            </div>

            {/* Thống kê */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Tổng số báo cáo</p>
                <p className="text-2xl font-bold">{reportData.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <p className="text-sm text-gray-500 mb-1">Hoàn thành</p>
                <p className="text-2xl font-bold">
                  {reportData.filter((r) => r.status === "Hoàn thành").length}
                </p>{" "}
              </div>{" "}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                {" "}
                <p className="text-sm text-gray-500 mb-1">
                  Đang tiến hành
                </p>{" "}
                <p className="text-2xl font-bold">
                  {
                    reportData.filter((r) => r.status === "Đang tiến hành")
                      .length
                  }
                </p>{" "}
              </div>{" "}
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                {" "}
                <p className="text-sm text-gray-500 mb-1">Chưa bắt đầu</p>{" "}
                <p className="text-2xl font-bold">
                  {reportData.filter((r) => r.status === "Chưa bắt đầu").length}
                </p>{" "}
              </div>{" "}
            </div>
            {/* Bảng báo cáo */}
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th
                    className="px-4 py-2 text-left text-gray-600 font-semibold cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    Mã báo cáo
                  </th>
                  <th
                    className="px-4 py-2 text-left text-gray-600 font-semibold cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Tên báo cáo
                  </th>
                  <th
                    className="px-4 py-2 text-left text-gray-600 font-semibold cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Trạng thái
                  </th>
                  <th
                    className="px-4 py-2 text-left text-gray-600 font-semibold cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    Ngày báo cáo
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className={`${getRowBackground(
                      report.type
                    )} cursor-pointer`}
                    onClick={() => handleRowClick(report)}
                  >
                    <td className="px-4 py-2">{report.id}</td>
                    <td className="px-4 py-2">{report.name}</td>
                    <td className="px-4 py-2">
                      {getStatusIcon(report.status)} {report.status}
                    </td>
                    <td className="px-4 py-2">{report.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal chi tiết báo cáo */}
          {isModalOpen && (
            <div
              className="fixed inset-0 bg-opacity-30 flex justify-center items-center z-50"
              onClick={closeModal}
            >
              <div
                className="bg-white rounded-lg shadow-lg w-1/3 p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold">{selectedReport.name}</h3>
                <p className="mt-2 text-gray-600">
                  {selectedReport.description}
                </p>
                <div className="mt-4">
                  <p>
                    <strong>Trạng thái:</strong> {selectedReport.status}
                  </p>
                  <p>
                    <strong>Giá trị:</strong> {selectedReport.value}
                  </p>
                  <p>
                    <strong>Tác giả:</strong> {selectedReport.author}
                  </p>
                  <p>
                    <strong>Ngày:</strong> {selectedReport.date}
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    onClick={closeModal}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        {/* Biểu đồ cảm biến */}
        <div className="flex justify-center items-center mb-6">
          <Graph />
        </div>
        <Footer className="w-full bg-blue-600 text-white p-4" />
      </div>
    </div>
  );
};
export default Reports;
