// components/shared/AttendanceDatePicker.jsx
import React from "react";

export const AttendanceDatePicker = ({
  value,
  onChange,
  label,
  className = "",
}) => (
  <div className={`mb-4 ${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="date"
      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
      value={value}
      onChange={onChange}
    />
  </div>
);
