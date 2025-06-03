export const fetchSensorData = async () => {
  try {
    const [tempRes, moistureRes, lightRes, soilRes] = await Promise.all([
      fetch("http://localhost:3000/api/v1/dht-temp/latest"),
      fetch("http://localhost:3000/api/v1/dht-moisure/latest"),
      fetch("http://localhost:3000/api/v1/light-sensor/latest"),
      fetch("http://localhost:3000/api/v1/soil-moisure/latest"),
    ]);

    if (!tempRes.ok || !moistureRes.ok || !lightRes.ok || !soilRes.ok) {
      throw new Error("Một hoặc nhiều API trả về lỗi");
    }

    const tempData = await tempRes.json();
    const moistureData = await moistureRes.json();
    const lightData = await lightRes.json();
    const soilData = await soilRes.json();

    return {
      temperature: {
        value: Number(tempData.data.value),
        feedId: tempData.data.feed_id,
        createdAt: tempData.data.created_at,
      },
      moisture: {
        value: Number(moistureData.data.value),
        feedId: moistureData.data.feed_id,
        createdAt: moistureData.data.created_at,
      },
      light: {
        value: Number(lightData.data.value),
        feedId: lightData.data.feed_id,
        createdAt: lightData.data.created_at,
      },
      soil: {
        value: Number(soilData.data.value),
        feedId: soilData.data.feed_id,
        createdAt: soilData.data.created_at,
      },
    };
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    throw error;
  }
};

// Fetch chart data for all sensors
export const fetchChartData = async () => {
  try {
    const [tempRes, moistureRes, lightRes, soilRes] = await Promise.all([
      fetch("http://localhost:3000/api/v1/dht-temp"),
      fetch("http://localhost:3000/api/v1/dht-moisure"),
      fetch("http://localhost:3000/api/v1/light-sensor"),
      fetch("http://localhost:3000/api/v1/soil-moisure"),
    ]);

    const tempData = await tempRes.json();
    const moistureData = await moistureRes.json();
    const lightData = await lightRes.json();
    const soilData = await soilRes.json();

    const transformData = (raw) => {
      const sliced = raw.data.slice(0, 12).reverse();

      return {
        labels: sliced.map((item) =>
          new Date(item.created_at).toLocaleTimeString("vi-VN")
        ),
        values: sliced.map((item) => Number(item.value)),
      };
    };

    return {
      temperature: transformData(tempData),
      moisture: transformData(moistureData),
      light: transformData(lightData),
      soil: transformData(soilData),
    };
  } catch (error) {
    console.error("Error fetching chart data:", error);
    throw error;
  }
};
