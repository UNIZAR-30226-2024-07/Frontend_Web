import React from "react";
import {Select, SelectItem} from "@nextui-org/react";

export function DropdownForm({ options, labelText, value, onChange, placeholderForm }) {
  return (
    <div className="max-w-xs my-form-container">
        <div className="form-input">{labelText}</div>
    <Select
          items={options}


          placeholder={placeholderForm}
          className="max-w-xs"
          value={value}
          onChange={onChange}
        >
          {(option) => <SelectItem key={option.value}>{option.label}</SelectItem>}
    </Select></div>
  );
}