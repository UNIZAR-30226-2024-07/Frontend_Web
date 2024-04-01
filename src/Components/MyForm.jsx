import { Input } from "@nextui-org/react";
import "./MyForm.css"

export function MyForm({ typeForm, placeholderForm, labelText }) {
  return (
    <div className="max-w-xs my-form-container">
      <Input
        isClearable
        isRequired
        key="outside"
        type={typeForm}
        label={<span style={{ fontSize: '18px', color: 'white', 
        fontFamily: 'Homer Simpson UI', fontWeight:'bold' }}>
        {labelText}</span>}
        labelPlacement="outside"
        placeholder={placeholderForm}
        className="custom-input"
      />
    </div>
  );
}



