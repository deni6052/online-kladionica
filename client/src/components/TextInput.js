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
  step,
  min,
  max,
  pattern,
}) {
  return (
    <div>
      {label && <label htmlFor="input-field">{label}</label>}
      <input
        className="app-input"
        step={step}
        min={min}
        max={max}
        type={type}
        value={value}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        pattern={pattern}
      />
    </div>
  );
}
