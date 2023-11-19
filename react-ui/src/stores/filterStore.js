import { create } from "zustand";

export const useFilterStore = create((set) => ({
  startDate: "4/10/2022",
  endDate: "6/10/2022",
  updateDateRange: (newStartDate, newEndDate) =>
    set((state) => ({
      ...state,
      startDate: newStartDate,
      endDate: newEndDate,
    })),
  gender: "All",
  updateGender: (newGenderSelection) =>
    set((state) => ({ ...state, gender: newGenderSelection })),
  age: "All",
  updateAge: (newAgeSelection) =>
    set((state) => ({ ...state, age: newAgeSelection })),
}));
