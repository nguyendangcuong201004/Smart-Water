import React, { useState } from "react";
import "./FlipCard.css";

const DevicesCard = ({
  title,
  value,
  sub,
  percent,
  detail,
  feedId,
  date,
  time,
}) => {
  const [flipped, setFlipped] = useState(false);

  const getStrokeColor = () => {
    if (percent < 30) return "#ef4444"; // red-500
    if (percent < 70) return "#f59e0b"; // amber-500
    return "#10b981"; // emerald-500
  };

  // Đảm bảo percent nằm trong khoảng 0-100
  const safePercent = Math.min(Math.max(percent, 0), 100);

  return (
    <div className="perspective" onClick={() => setFlipped(!flipped)}>
      <div
        className={`relative w-full h-64 transition-transform duration-500 transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 bg-gray-900 rounded-lg p-6 text-white shadow backface-hidden">
          <h2 className="text-lg font-semibold mb-4">{title}</h2>

          {/* Cải thiện căn chỉnh ở đây */}
          <div className="flex flex-col items-center justify-center h-3/4 relative">
            <svg
              className="w-32 h-32 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#2d3748"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke={getStrokeColor()}
                strokeWidth="10"
                fill="none"
                strokeDasharray="282.6"
                strokeDashoffset={282.6 - (safePercent / 100) * 282.6}
                strokeLinecap="round"
              />
            </svg>

            {/* Div chứa giá trị - chuyển thành flex với căn chỉnh */}
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <div className="text-3xl font-bold">{value}</div>
              <p className="text-sm text-gray-300 mt-1">{sub}</p>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 bg-gray-900 rounded-lg p-6 text-white shadow transform rotate-y-180 backface-hidden overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Chi tiết {title}</h2>
          <p className="mb-4 text-gray-200">{detail}</p>

          <div className="space-y-2">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-300">Ngày ghi nhận: {date}</p>
            </div>

            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
              <p className="text-sm text-gray-300">Feed ID: {feedId}</p>
            </div>

            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-gray-300">Thời gian: {time}</p>
            </div>

            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="text-sm text-gray-300">Giá trị: {value}</p>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-gray-400">
            Nhấn để quay lại
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevicesCard;
