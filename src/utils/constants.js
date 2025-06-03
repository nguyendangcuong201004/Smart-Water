export const API_BASE_URL = "http://localhost:3000/api/v1";

export const API_ENDPOINTS = {
  TEMPERATURE: "/dht-temp",
  MOISTURE: "/dht-moisure",
  LIGHT: "/light-sensor",
  SOIL: "/soil-moisure",
};

export const CHART_CONFIG = {
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
