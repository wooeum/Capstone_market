import React from "react";
import PrimaryButton from "./PrimaryButton";
import "./Modal.css";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2 className="modal-title">상품 삭제</h2>
        <div className="modal-content">
          <p>정말로 {productName}을(를) 삭제하시겠습니까?</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <PrimaryButton
            onClick={onConfirm}
            style={{
              flex: 1,
              background: "#ff4d4f",
              color: "white",
              border: "none",
            }}
          >
            삭제
          </PrimaryButton>
          <PrimaryButton
            onClick={onClose}
            style={{
              flex: 1,
              background: "#f5f5f5",
              color: "#666",
              border: "1px solid #ddd",
            }}
          >
            취소
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
