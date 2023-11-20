import React, { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useLocation, useNavigate } from "react-router-dom";
import { useFilterStore } from "../stores/filterStore";
import { generateRandomColor, getCookie } from "../Components/utility";
import apiService from "../api/apiService";
import FilterComponent from "../Components/FilterComponent";
import BarChart from "../Components/BarChart";
import { LineChart } from "../Components/LineChart";

function Dashboard() {
  const [data, setData] = useState();
  const [barChartData, setBarChartData] = useState();
  const [lineChartData, setLineChartData] = useState();
  const [activeFeature, setActiveFeature] = useState();
  const [featureColorMap, setFeatureColorMap] = useState();
  const updateGender = useFilterStore((state) => state.updateGender);
  const updateAge = useFilterStore((state) => state.updateAge);
  const { age, gender, startDate, endDate } = useFilterStore(
    useShallow((state) => ({
      age: state.age,
      gender: state.gender,
      startDate: state.startDate,
      endDate: state.endDate,
    }))
  );

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ageParam = params.get("age");
    const genderParam = params.get("gender");

    if (ageParam) {
      updateAge(ageParam);
      document.cookie = `age=${ageParam}; path=/`;
    } else {
      const savedAge = getCookie("age");
      if (savedAge) {
        updateAge(savedAge);
      }
    }

    if (genderParam) {
      updateGender(genderParam);
    } else {
      const savedGender = getCookie("gender");
      if (savedGender) {
        updateGender(savedGender);
      }
    }
  }, [location.search]);

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
    setBarChartData(requiredBarChartData);
    setLineChartData(requiredLineChartData);
  };

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
    if (!age || !gender || !data) return;
    if (!activeFeature) setActiveFeature(Object.keys(data)[0]);
    if (!featureColorMap)
      setFeatureColorMap(
        Object.keys(data).reduce(
          (a, x) => ({ ...a, [x]: generateRandomColor(0.7) }),
          {}
        )
      );
    if (navigate)
      if (age !== "All" || gender !== "All") {
        const params = new URLSearchParams();
        if (age) {
          params.set("age", age);
          document.cookie = `age=${age}; path=/`;
        }
        if (gender) {
          params.set("gender", gender);
          document.cookie = `gender=${gender}; path=/`;
        }
        navigate(`?${params.toString()}`);
      } else navigate("");
    updateChartData(age, gender);
  }, [age, gender, data]);

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

export default Dashboard;
