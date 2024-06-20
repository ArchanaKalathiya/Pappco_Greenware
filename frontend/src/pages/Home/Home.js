import React, { useEffect } from "react";
import { RiProductHuntLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import Lottie from "react-lottie-player";
import animationData from "./lottieAnimation.json";
import "./Home.scss";

const Home = () => {
  useEffect(() => {
    const cursor = document.querySelector(".dot-cursor");
    const cursorShadow = document.querySelector(".dot-cursor-shadow");

    if (!cursor || !cursorShadow) {
      console.error("Cursor elements not found");
      return;
    }

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursorShadow.style.left = `${e.clientX}px`;
      cursorShadow.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <div className="home">
      <div className="dot-cursor"></div>
      <div className="dot-cursor-shadow"></div>
      <div className="logo-container">
        <img src="http://localhost:3000/pappco_logo.png" alt="Pappco Logo" />
      </div>
      <nav className="container --flex-between">
        <div className="logo">
          <RiProductHuntLine size={35} />
        </div>
        <ul className="home-links">
          <li className="register">
            <Link to="/register">Sign Up</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </nav>
      <section className="container">
        <div className="text">
          <h2>MADE FROM 100% PLANT FIBRES</h2>
          <p>'PAPPCO IS THE ONLY BRAND SUPPLYING 100% OIL PROOFED BAGASSE PRODUCTS IN INDIA'</p>
          <h4>WHY PAPPCO?</h4>
          <ul>
            <li>MADE FROM RENEWABLE PLANT FIBERS</li>
            <li>100% PLASTIC FREE</li>
            <li>FOOD CONTACT SAFE</li>
            <li>100% COMPOSTABLE</li>
            <li>MICROWAVE & FREEZER SAFE</li>
          </ul>
          <div className="hero-buttons">
            <button className="--btn --btn-secondary button">
              <Link to="/dashboard" className="button-color">Dashboard</Link>
              <div className="button__horizontal"></div>
              <div className="button__vertical"></div>
            </button>
          </div>
        </div>
        <div className="lottie-container">
          <Lottie
            loop
            animationData={animationData}
            play
            style={{ width: 400, height: 400 }}
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
