import React from "react";
import "./Button.css";

export default function Button({
  color,
  type = "button",
  onClick,
  label,
  disabled,
}) {
  return (
    <button
      className={"button " + color}
      type={type || "button"}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
