import React from "react";
import "./IntroCard.css";
import cartIcon from "/cart.png";

const IntroCard = ({ title, subtitle }) => {
  return (
    <div className="intro-card">
      <div className="title-container">
        <img src={cartIcon} alt="cart" className="cart-icon" />
        <h1>{title}</h1>
      </div>
      <p>{subtitle}</p>
    </div>
  );
};

export default IntroCard;
