import React from "react";
import {
  FaUser,
  FaTools,
  FaChartBar,
  FaCalendarAlt,
  FaUsersCog,
} from "react-icons/fa";
import { GrConfigure } from "react-icons/gr";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { isAdmin, currentUser } = useAuth();

  const navItems = [
    { to: "/account", icon: <FaUser />, label: "Tài khoản" },
    { to: "/devices", icon: <FaTools />, label: "Thiết bị" },
    // { to: "/reports", icon: <FaChartBar />, label: "Báo cáo" },
    { to: "/configdevice", icon: <GrConfigure />, label: "Điều chỉnh" },
    { to: "/schedule", icon: <FaCalendarAlt />, label: "Lập Lịch" },
  ];

  if (isAdmin && isAdmin()) {
    navItems.push({
      to: "/admin",
      icon: <FaUsersCog />,
      label: "Quản lý người dùng",
    });
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white w-1/6 flex flex-col shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-center h-16 bg-gray-800 border-b border-zinc-700 shadow-md">
        <Link to="/" className="text-2xl font-bold tracking-wide text-white">
          SMART WATER
        </Link>
      </div>

      {/* User Info */}
      {currentUser && (
        <div className="px-4 py-3 border-b border-zinc-700 bg-gray-800">
          <div className="text-sm text-zinc-300">Xin chào,</div>
          <div className="text-md font-semibold text-white truncate">
            {currentUser.name || currentUser.username}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-grow overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map(({ to, icon, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-150 ${
                  location.pathname === to
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-500/70 hover:text-white text-zinc-300"
                }`}
              >
                <span className="text-lg">{icon}</span>
                <span className="text-sm font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
