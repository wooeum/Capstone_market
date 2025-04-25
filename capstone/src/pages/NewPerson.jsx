import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";
import Modal from "../components/Modal";
import "./NewPerson.css";
import congratsIcon from "/cong.png";

const NewPerson = () => {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    phoneNumber: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/cart/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          birth_date: formData.birthDate,
          phone_number: formData.phoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Phone number already exists") {
          setModalTitle("회원가입 실패");
          setModalMessage("이미 회원가입이 되어있습니다.");
          setShowModal(true);
          return;
        }
        throw new Error(data.message || "회원가입에 실패했습니다");
      }

      setModalTitle("회원가입 완료");
      setModalMessage("회원가입이 완료되었습니다.");
      setShowModal(true);

      // 모달 확인 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setModalTitle("오류");
      setModalMessage("회원가입에 실패했습니다. 다시 시도해주세요.");
      setShowModal(true);
    }
  };

  return (
    <main className="new-person-container">
      <div className="new-person-card">
        <h1 className="new-person-title">회원가입</h1>
        <form onSubmit={handleSubmit} className="new-person-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              className="form-input"
              required
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="birthDate" className="form-label">
              생년월일
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="form-input"
              required
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">
              전화번호
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="010-0000-0000"
              className="form-input"
              required
              autoComplete="off"
            />
          </div>

          <PrimaryButton type="submit" className="w-full">
            가입하기
          </PrimaryButton>

          <PrimaryButton
            type="button"
            className="w-full mt-4"
            onClick={() => navigate("/login")}
          >
            로그인 하러가기
          </PrimaryButton>
        </form>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
      >
        <div className="modal-message-center">
          {modalTitle === "회원가입 완료" && (
            <img src={congratsIcon} alt="축하" className="inline-icon" />
          )}
          <span>{modalMessage}</span>
        </div>
      </Modal>
    </main>
  );
};

export default NewPerson;
