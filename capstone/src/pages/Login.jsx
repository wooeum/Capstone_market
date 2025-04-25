import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";
import Modal from "../components/Modal";
import "./Login.css";
import keyIcon from "/key.png";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (phoneNumber) => {
    try {
      const response = await fetch("http://localhost:8000/api/cart/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          sessionStorage.setItem("user", JSON.stringify(data.user));
          navigate("/list");
        } else {
          setModalTitle("로그인 실패");
          setModalMessage(
            "존재하지 않는 정보입니다. 회원가입 후 이용해주시기 바랍니다."
          );
          setShowModal(true);
        }
      } else {
        if (response.status === 404) {
          setModalTitle("로그인 실패");
          setModalMessage(
            "존재하지 않는 정보입니다. 회원가입 후 이용해주시기 바랍니다."
          );
          setShowModal(true);
        } else {
          throw new Error("로그인에 실패했습니다");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setModalTitle("오류");
      setModalMessage("로그인에 실패했습니다. 다시 시도해주세요.");
      setShowModal(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      handleLogin(phoneNumber);
    }
  };

  return (
    <main className="login-container">
      <div className="login-card">
        <h1 className="login-title">
          <img src={keyIcon} alt="로그인" className="title-icon" />
          <span>Login</span>
        </h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              전화번호
            </label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="010-0000-0000"
              className="form-input"
              required
              autoComplete="off"
            />
          </div>
          <PrimaryButton type="submit" className="w-full">
            로그인
          </PrimaryButton>
          <PrimaryButton
            type="button"
            className="w-full mt-4"
            onClick={() => navigate("/new-person")}
          >
            회원가입
          </PrimaryButton>
        </form>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
      >
        <p>{modalMessage}</p>
      </Modal>
    </main>
  );
};

export default Login;
