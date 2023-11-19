import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, getElementAtEvent } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Aggregated total time on features",
    },
  },
};

function BarChart({ aggregatedData, handleBarClick, featureColorMap }) {
  const [labels, setLabels] = useState(["A", "B", "C", "D", "E", "F"]);
  useEffect(() => setLabels(Object.keys(aggregatedData)), [aggregatedData]);
  const barChartRef = useRef(null);

  const handleChartClick = (event) => {
    const { current: chart } = barChartRef;
    if (!chart) {
      return;
    }
    if (getElementAtEvent(chart, event).length) {
      handleBarClick(labels[getElementAtEvent(chart, event)[0].index]);
    }
  };

  return (
    <div style={{ width: "50rem", display: "flex" }}>
      {aggregatedData ? (
        <Bar
          ref={barChartRef}
          options={options}
          data={{
            labels: labels,
            datasets: [
              {
                label: "Aggregate Time",
                data: labels.map((x) => aggregatedData[x]),
                backgroundColor: labels.map((x) => featureColorMap[x]),
              },
            ],
          }}
          onClick={handleChartClick}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default BarChart;
