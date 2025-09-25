import React from "react";
import Select from "@/components/atoms/Select";

const StatusFilter = ({ value, onChange, options, placeholder = "All Status" }) => {
  return (
    <Select value={value} onChange={onChange}>
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
};

export default StatusFilter;