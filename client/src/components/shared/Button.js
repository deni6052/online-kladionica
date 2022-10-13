import React from "react";
import "./Button.css";

export default function Button({
  color,
  type = "button",
  clickHandler,
  label,
  disabled,
}) {
  return (
    <button
      className={"button " + color}
      type={type || "button"}
      onClick={clickHandler}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
