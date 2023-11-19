const apiService = {
  fetchData: async () => {
    const transformData = (data) => {
      const transformedData = {};

      data.forEach((entry) => {
        Object.keys(entry).forEach((key) => {
          if (key !== "Day" && key !== "Age" && key !== "Gender") {
            if (!transformedData[key]) {
              transformedData[key] = [];
            }
            transformedData[key].push({
              day: entry.Day,
              age: entry.Age,
              gender: entry.Gender,
              time: entry[key],
            });
          }
        });
      });
      return transformedData;
    };

    try {
      const response = await fetch(
        "https://data-visualisation-dashboard-api.onrender.com/api/data"
      );
      const data = await response.json();
      return transformData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
};

export default apiService;
