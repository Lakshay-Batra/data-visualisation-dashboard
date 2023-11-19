import React, { useEffect, useState } from "react";
import CustomDropdown from "./CustomDropdown";
import { useFilterStore } from "../stores/filterStore";
import { useShallow } from "zustand/react/shallow";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

function FilterComponent({ minDate, maxDate }) {
  const updateGender = useFilterStore((state) => state.updateGender);
  const updateAge = useFilterStore((state) => state.updateAge);
  const updateDateRange = useFilterStore((state) => state.updateDateRange);

  const { age, gender, startDate, endDate } = useFilterStore(
    useShallow((state) => ({
      age: state.age,
      gender: state.gender,
      startDate: state.startDate,
      endDate: state.endDate,
    }))
  );

  const ageOptions = ["All", "15-25", ">25"];
  const genderOptions = ["All", "Male", "Female"];

  useEffect(() => {
    // updateAge(ageOptions[0]);
    // updateGender(genderOptions[0]);
  }, []);

  useEffect(() => {
    if (minDate && maxDate)
      setSelectedDates([
        {
          startDate: new Date(minDate),
          endDate: new Date(maxDate),
          key: "selection",
        },
      ]);
  }, [minDate, maxDate]);

  const [selectedDates, setSelectedDates] = useState([]);

  const handleSelect = (ranges) => {
    setSelectedDates([ranges.selection]);
  };

  return (
    <div className="d-flex m-4 align-items-center">
      Age Group:&nbsp;
      <CustomDropdown
        options={ageOptions}
        selectedValue={age}
        handleSelctionChange={updateAge}
      />
      &emsp; Gender:&nbsp;
      <CustomDropdown
        options={genderOptions}
        selectedValue={gender}
        handleSelctionChange={updateGender}
      />
      &ensp;
      {/* {minDate && maxDate ? (
        <DateRangePicker
          ranges={[
            {
              startDate: new Date(),
              endDate: new Date(),
              key: "selection",
            },
          ]}
          onChange={handleSelect}
          minDate={new Date()}
          maxDate={new Date().setDate(new Date().getDate() + 7)}
        />
      ) : (
        <></>
      )} */}
    </div>
  );
}

export default FilterComponent;
