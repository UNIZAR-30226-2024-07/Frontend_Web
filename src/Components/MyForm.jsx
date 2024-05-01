// MyForm.jsx
import { Input } from "@nextui-org/react";

export function MyForm({ typeForm, placeholderForm, labelText, value, onChange }) {
  return (
    <div className="max-w-xs my-form-container">
      <div className="form-input">{labelText}</div>
      <Input
        type={typeForm}
        placeholder={placeholderForm}
        labelPlacement="outside"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
