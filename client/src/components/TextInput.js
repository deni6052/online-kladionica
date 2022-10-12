import React from "react";
import "./TextInput.css";

export default function TextInput({
  value,
  label,
  name,
  placeholder,
  type = "text",
  onChange,
  required,
}) {
  return (
    <div>
      {label && <label htmlFor="input-field">{label}</label>}
      <input
        className="app-input"
        type={type}
        value={value}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
