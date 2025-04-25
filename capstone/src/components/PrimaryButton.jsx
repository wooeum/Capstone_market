import React from "react";
import "./PrimaryButton.css";

export default function PrimaryButton({ children, onClick, className = "" }) {
  return (
    <button onClick={onClick} className={`primary-button ${className}`}>
      {children}
    </button>
  );
}
