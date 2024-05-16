// MyForm.jsx
import { Input } from "@nextui-org/react";

export function MyForm({ typeForm, placeholderForm, labelText, value, onChange, defaultValue}) {
  return (
    <div className="max-w-xs my-form-container">
      <div className="form-input">{labelText}</div>
      <Input
        isRequired
        type={typeForm}
        placeholder={placeholderForm}
        labelPlacement="outside"
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
      />
    </div>
  );
}
