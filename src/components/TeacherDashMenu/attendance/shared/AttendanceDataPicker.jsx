// components/shared/AttendanceDatePicker.jsx
import React from "react";

export const AttendanceDatePicker = ({ selected, onChange }) => {
  const handleChange = (e) => {
    const dateValue = e.target.value; // This will be in YYYY-MM-DD format
    if (dateValue) {
      onChange(new Date(dateValue)); // Convert to Date object
    }
  };

  return (
    <input
      type="date"
      value={selected ? selected.toISOString().split("T")[0] : ""} // safe check
      onChange={handleChange}
      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
    />
  );
};
