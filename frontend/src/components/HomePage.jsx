import React from "react";
import { useNavigate } from "react-router-dom";
import MainHeader from "./elements/MainHeader";

import "../style/HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  function navigateToLogin() {
    navigate("/login");
  }

  function navigateToSignup() {
    navigate("/signup");
  }

  return (
    <React.Fragment>
      <MainHeader />
      <h1 className="header">Hello</h1>
      <div className="d-grid gap-3 col-2 mx-auto">
        <button className="btn btn-primary" type="button" onClick={navigateToSignup}>
          Signup
        </button>
        <button className="btn btn-primary" type="button" onClick={navigateToLogin}>
          Login
        </button>
      </div>
    </React.Fragment>
  );
}

export default HomePage;
