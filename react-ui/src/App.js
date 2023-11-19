import React, { useEffect, useReducer, useState } from "react";
import apiService from "./api/apiService";
import BarChart from "./Components/BarChart";
import { LineChart } from "./Components/LineChart";
import generateRandomColor from "./Components/utility";
import FilterComponent from "./Components/FilterComponent";
import { useFilterStore } from "./stores/filterStore";
import { useShallow } from "zustand/react/shallow";

function App() {
  const [data, setData] = useState();
  const [barChartData, setBarChartData] = useState();
  const [lineChartData, setLineChartData] = useState();
  const [activeFeature, setActiveFeature] = useState();
  const [featureColorMap, setFeatureColorMap] = useState();
  const { age, gender, startDate, endDate } = useFilterStore(
    useShallow((state) => ({
      age: state.age,
      gender: state.gender,
      startDate: state.startDate,
      endDate: state.endDate,
    }))
  );

  const initialiseChart = () => {
    if (!data) return;
    const requiredBarChartData = {};
    const requiredLineChartData = {};
    Object.keys(data).forEach((key) => {
      requiredBarChartData[key] =
        data[key].reduce((a, x) => a + x.time, 0) / 60;
      requiredLineChartData[key] = {};
      data[key].forEach((record) => {
        if (record.day in requiredLineChartData[key]) {
          requiredLineChartData[key][record.day] += record.time / 60;
        } else {
          requiredLineChartData[key][record.day] = record.time / 60;
        }
      });
    });
    if (!featureColorMap)
      setFeatureColorMap(
        Object.keys(requiredBarChartData).reduce(
          (a, x) => ({ ...a, [x]: generateRandomColor(0.7) }),
          {}
        )
      );
    setBarChartData(requiredBarChartData);
    setLineChartData(requiredLineChartData);
  };

  useEffect(() => {
    if (!data) return;
    setActiveFeature(Object.keys(data)[0]);
    initialiseChart();
  }, [data]);

  const updateChartData = (age, gender) => {
    if (age === "All" && gender === "All") {
      initialiseChart();
      return;
    }
    const requiredBarChartData = {};
    const requiredLineChartData = {};
    Object.keys(data).forEach((key) => {
      requiredBarChartData[key] =
        data[key].reduce(
          (a, x) =>
            a +
            ((x.age === age || age === "All") &&
            (x.gender === gender || gender === "All")
              ? x.time
              : 0),
          0
        ) / 60;
      requiredLineChartData[key] = {};
      data[key].forEach((record) => {
        if (record.day in requiredLineChartData[key]) {
          requiredLineChartData[key][record.day] +=
            ((record.age === age || age === "All") &&
            (record.gender === gender || gender === "All")
              ? record.time
              : 0) / 60;
        } else {
          requiredLineChartData[key][record.day] =
            ((record.age === age || age === "All") &&
            (record.gender === gender || gender === "All")
              ? record.time
              : 0) / 60;
        }
      });
    });
    setBarChartData(requiredBarChartData);
    setLineChartData(requiredLineChartData);
  };
  useEffect(() => {
    if (!age || !gender) return;
    updateChartData(age, gender);
  }, [age, gender]);
  const fetchData = async () => {
    const response = await apiService.fetchData();
    setData(response);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div style={{ textAlign: "center" }}>
      {lineChartData ? (
        <FilterComponent
          minDate={Object.keys(lineChartData)[0]}
          maxDate={
            Object.keys(lineChartData)[Object.keys(lineChartData).length - 1]
          }
          handleValueUpdate={updateChartData}
        />
      ) : (
        <></>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        {barChartData ? (
          <BarChart
            aggregatedData={barChartData}
            handleBarClick={(feature) => setActiveFeature(feature)}
            featureColorMap={featureColorMap}
          />
        ) : (
          <></>
        )}
        {lineChartData ? (
          <LineChart
            aggregatedData={lineChartData[activeFeature]}
            activeFeature={activeFeature}
            lineColor={featureColorMap[activeFeature]}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default App;
