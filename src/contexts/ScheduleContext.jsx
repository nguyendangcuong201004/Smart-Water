// contexts/ScheduleContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API instance
  const api = axios.create({
    baseURL: "https://server-smart-water.vercel.app/api/v1",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Fetch schedules when component mounts
  useEffect(() => {
    fetchSchedules();

    const interval = setInterval(() => {
      fetchSchedules();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const [scheduleRes, moistureRes, tempRes] = await Promise.all([
        api.get("/watering-schedule"),
        api.get("/dht-moisure/latest"),
        api.get("/dht-temp/latest"),
      ]);
      const schedules = scheduleRes.data.schedules || [];
      const now = new Date();

      const moisture = moistureRes.data?.data?.value ?? "N/A";
      const temperature = tempRes.data?.data?.value ?? "N/A";

      const pastSchedules = schedules.filter(
        (item) => new Date(item.date) < now
      );
      const futureSchedules = schedules.filter(
        (item) => new Date(item.date) >= now
      );

      const parsedHistory = pastSchedules.map((item) => {
        const dateObj = new Date(item.date);
        const date = dateObj.toISOString().split("T")[0];
        const time = dateObj.toTimeString().split(":").slice(0, 2).join(":");

        return {
          date,
          time,
          moisture,
          temperature,
        };
      });

      setHistory(parsedHistory);
      setEvents(futureSchedules); // cập nhật lại events chỉ còn lịch chưa diễn ra
      setError(null);
    } catch (err) {
      console.error("Error loading schedule data:", err);
      setError("Could not load schedule data");
    } finally {
      setLoading(false);
    }
  };

  // Add a new schedule
  const addSchedule = async (scheduleData) => {
    try {
      const response = await api.post("/watering-schedule", scheduleData);

      // Update state after successful addition
      setEvents((prev) => [...prev, response.data.schedule]);

      // Reload all data to update history
      await fetchSchedules();

      return { success: true, message: "Schedule added successfully" };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Could not add schedule";
      console.error(errorMessage, err);
      return { success: false, message: errorMessage };
    }
  };

  // Delete a schedule
  const deleteSchedule = async (scheduleId) => {
    try {
      await api.delete(`/watering-schedule/${scheduleId}`);

      // Update state after deletion
      setEvents((prev) => prev.filter((event) => event._id !== scheduleId));

      return { success: true, message: "Schedule deleted successfully" };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Could not delete schedule";
      console.error(errorMessage, err);
      return { success: false, message: errorMessage };
    }
  };

  const updateSchedule = async (scheduleId, updatedData) => {
    try {
      const response = await api.put(
        `/watering-schedule/${scheduleId}`,
        updatedData
      );

      setEvents((prev) =>
        prev.map((event) =>
          event._id === scheduleId ? response.data.schedule : event
        )
      );

      return { success: true, message: "Schedule updated successfully" };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Could not update schedule";
      console.error(errorMessage, err);
      return { success: false, message: errorMessage };
    }
  };

  const value = {
    events,
    history,
    loading,
    error,
    fetchSchedules,
    addSchedule,
    deleteSchedule,
    updateSchedule,
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};

// Custom hook to use Schedule Context
export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};
