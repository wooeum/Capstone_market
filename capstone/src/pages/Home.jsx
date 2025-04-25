import React from "react";
import { useNavigate } from "react-router-dom";
import IntroCard from "../components/IntroCard";
import PrimaryButton from "../components/PrimaryButton";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="home-container">
      <IntroCard
        title="Smart Cart Demo"
        subtitle="반가워요! 로그인 후 카트에 물건을 담아보세요."
      />

      <PrimaryButton
        onClick={() => navigate("/login")}
        className="login-button"
      >
        로그인하기
      </PrimaryButton>
    </main>
  );
}
