// MyForm.jsx
import { Input } from "@nextui-org/react";

export function MyForm({ typeForm, placeholderForm, labelText, value, onChange }) {
  return (
    <div className="max-w-xs my-form-container">
      <Input
        type={typeForm}
        label={<span className="form-input">{labelText}</span>}
        placeholder={placeholderForm}
        labelPlacement="outside"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
