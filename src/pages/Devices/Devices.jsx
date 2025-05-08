import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import DevicesCard from "./DevicesCard";
import SensorChart from "../../components/SensorChart";
import Loading from "../../components/Loading";
import { useSensorData } from "../../hooks/useSensorData";

const Devices = () => {
  const [selectedChart, setSelectedChart] = useState("temperature");
  const { data, chartData, loading, error, refreshData } = useSensorData();
  const { temperature, moisture, light, soil } = data;
  const generateMockData = (baseValue, variance, length) => {
    return Array.from({ length }, (_, i) => {
      const hour = i % 24;
      const timeInfluence =
        Math.sin((hour / 24) * Math.PI * 2) * variance * 0.5;
      const randomness = (Math.random() - 0.5) * variance;
      return Math.round(baseValue + timeInfluence + randomness);
    });
  };

  const cards = [
    {
      type: "temperature",
      title: "Temperature",
      value: `${temperature.value}°C`,
      sub: "degree C",
      percent: ((temperature.value - 4) / (60 - 4)) * 100,
      detail: "Nhiệt độ đo được từ cảm biến DHT11",
      feedId: temperature.feedId, // lấy feed_id từ API
      date: new Date(temperature.createdAt).toLocaleDateString("vi-VN"),
      time: new Date(temperature.createdAt).toLocaleTimeString("vi-VN"),
    },
    {
      type: "moisture",
      title: "Air moisture",
      value: `${moisture.value}`,
      sub: "Value",
      percent: moisture.value,
      detail: "Độ ẩm không khí hiện tại được cảm biến thu nhận",
      feedId: moisture.feedId,
      date: new Date(moisture.createdAt).toLocaleDateString("vi-VN"),
      time: new Date(moisture.createdAt).toLocaleTimeString("vi-VN"),
    },
    {
      type: "light",
      title: "Light Sensor",
      value: `${light.value}`,
      sub: "Lux",
      percent: (light.value / 100) * 100,
      detail: "Cường độ ánh sáng từ cảm biến ánh sáng môi trường",
      feedId: light.feedId,
      date: new Date(light.createdAt).toLocaleDateString("vi-VN"),
      time: new Date(light.createdAt).toLocaleTimeString("vi-VN"),
    },
    {
      type: "soil",
      title: "Soil Moisture",
      value: `${soil.value}%`,
      sub: "Value",
      percent: soil.value,
      detail: "Độ ẩm của đất tại vị trí cảm biến",
      feedId: soil.feedId,
      date: new Date(soil.createdAt).toLocaleDateString("vi-VN"),
      time: new Date(soil.createdAt).toLocaleTimeString("vi-VN"),
    },
  ];

  const chartConfig = {
    temperature: {
      title: "Nhiệt độ",
      lineColor: "rgb(239, 68, 68)",
      yAxisLabel: "°C",
    },
    moisture: {
      title: "Độ ẩm không khí",
      lineColor: "rgb(59, 130, 246)",
      yAxisLabel: "%",
    },
    light: {
      title: "Cường độ ánh sáng",
      lineColor: "rgb(234, 179, 8)",
      yAxisLabel: "Lux",
    },
    soil: {
      title: "Độ ẩm đất",
      lineColor: "rgb(34, 197, 94)",
      yAxisLabel: "%",
    },
  };

  if (loading && Object.values(data).every((sensor) => sensor.value === 0)) {
    return <Loading />;
  }
  // if (error) {
  //   return (
  //     <div className="flex min-h-screen justify-center items-center">
  //       <div className="bg-red-100 p-4 rounded-lg">
  //         <p className="text-red-700">Lỗi: {error}</p>
  //         <button
  //           onClick={refreshData}
  //           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
  //         >
  //           Thử lại
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-1/6 min-h-screen bg-gray-800 text-white fixed top-0 left-0 z-50" />

      <div className="flex flex-col w-5/6">
        <Header className="w-full bg-blue-500 text-white p-4 " />
        <main className="flex-grow container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-6 text-[#5f6fff]">
            Bảng điều khiển thiết bị
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
            {cards.map((card, index) => (
              <DevicesCard key={index} {...card} />
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-blue-500">
              Biểu đồ dữ liệu cảm biến
            </h2>

            <div className="flex border-b border-gray-200 mb-4">
              {Object.keys(chartConfig).map((type) => (
                <button
                  key={type}
                  className={`px-4 py-2 font-medium ${
                    selectedChart === type
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setSelectedChart(type)}
                >
                  {chartConfig[type].title}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <SensorChart
                title={chartConfig[selectedChart].title}
                chartData={chartData[selectedChart]}
                yAxisLabel={chartConfig[selectedChart].yAxisLabel}
                lineColor={chartConfig[selectedChart].lineColor}
              />
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>
                Biểu đồ hiển thị dữ liệu theo thời gian thực 12 giờ qua. Cập
                nhật mỗi phút.
              </p>
              <p className="mt-1">
                Giá trị hiện tại:
                <span className="font-semibold ml-1">
                  {selectedChart === "temperature" && temperature.value + "°C"}
                  {selectedChart === "moisture" && moisture.value + "%"}
                  {selectedChart === "light" && light.value + " Lux"}
                  {selectedChart === "soil" && soil.value + "%"}
                </span>
              </p>
            </div>
          </div>
        </main>
        <Footer className="w-full bg-gray-200 text-center p-4" />
      </div>
    </div>
  );
};

export default Devices;
