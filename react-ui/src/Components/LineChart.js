import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

export function LineChart({ aggregatedData, activeFeature, lineColor }) {
  return (
    <div style={{ width: "50rem" }}>
      {aggregatedData ? (
        <Line
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: `Time spent on feature ${activeFeature}`,
              },
            },
          }}
          data={{
            labels: Object.keys(aggregatedData),
            datasets: [
              {
                label: "Time for day",
                data: Object.keys(aggregatedData).map((x) => aggregatedData[x]),
                borderColor: lineColor,
                backgroundColor: lineColor,
              },
            ],
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
