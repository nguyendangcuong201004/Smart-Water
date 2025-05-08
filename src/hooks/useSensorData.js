import { useState, useEffect } from "react";
import { fetchSensorData, fetchChartData } from "../services/sensorService";
export const useSensorData = (refreshInterval = 60000) => {
  const [data, setData] = useState({
    temperature: { value: 0, feedId: "", createdAt: new Date() },
    moisture: { value: 0, feedId: "", createdAt: new Date() },
    light: { value: 0, feedId: "", createdAt: new Date() },
    soil: { value: 0, feedId: "", createdAt: new Date() },
  });

  const [chartData, setChartData] = useState({
    temperature: { labels: [], values: [] },
    moisture: { labels: [], values: [] },
    light: { labels: [], values: [] },
    soil: { labels: [], values: [] },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      const sensorData = await fetchSensorData();
      setData(sensorData);

      const charts = await fetchChartData();
      setChartData(charts);

      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    const intervalId = setInterval(() => {
      refreshData();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  return { data, chartData, loading, error, refreshData };
};
