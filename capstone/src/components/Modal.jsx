import React from "react";
import PrimaryButton from "./PrimaryButton";
import "./Modal.css";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2 className="modal-title">{title}</h2>
        <div className="modal-content">{children}</div>
        <PrimaryButton onClick={onClose} className="modal-button">
          확인
        </PrimaryButton>
      </div>
    </div>
  );
};

export default Modal;
