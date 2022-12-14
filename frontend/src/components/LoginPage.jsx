import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../auth-context";

import {validateEmail, validatePassword} from "../checks";

import MainHeader from "./elements/MainHeader";
import ErrorPage from "./ErrorPage";

import "../style/AuthPages.css";

import ErrorIcon from "@mui/icons-material/Error";
import Grow from "@mui/material/Grow";

function LoginPage() {
  const authContext = useContext(AuthContext);

  const navigate = useNavigate();

  const [isValidEmail, setIsValidEmail] = useState(true); 
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isErrorPage, setIsErrorPage] = useState(false);

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  function updateUserInfo(event) {
    const { name, value } = event.target;
    setUserInfo((previousValue) => {
      return {
        ...previousValue,
        [name]: value,
      };
    });
  }

  async function tryToLogin(event) {
    event.preventDefault();

    if (!validateEmail(userInfo.email)) {
      setIsValidEmail(false);
      return;
    }
    
    setIsValidEmail(true);

    if (!validatePassword(userInfo.password)) {
      setIsValidPassword(false);
      return;
    }

    setIsValidPassword(true);

  try{
    const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/login", { // move host to config file
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userInfo.email,
        password: userInfo.password,
      }),
    });

    const data = await response.json();

    if (data.errorMessage) {
      alert(data.errorMessage);
      backToHomePage();
      return;
    }

    const userId = data.userId;
    const token = data.token;

    authContext.login(userId, token);
  }catch(error){
    setIsErrorPage(true);
    return;
  }

    setUserInfo({
      email: "",
      password: "",
    });

    navigate("/user/lists");
  }

  function backToHomePage() {
    navigate("/");
  }

  return (
    <React.Fragment>
    {isErrorPage ? <ErrorPage />:<div>
      <MainHeader />
      <form className="auth-form">
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="email"
            onChange={updateUserInfo}
            value={userInfo.email}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
          {isValidEmail ? null : (
            <Grow in={!isValidEmail}>
              <div>
                <ErrorIcon className="warning-icon" />
                <p className="warning-text form-label">Invalid email.</p>
              </div>
            </Grow>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            onChange={updateUserInfo}
            value={userInfo.password}
          />
          {isValidPassword ? null : (
            <Grow in={!isValidPassword}>
              <div>
                <ErrorIcon className="warning-icon" />
                <p className="warning-text form-label">
                  Short password. Password must contain at least 6 characters.
                </p>
              </div>
            </Grow>
          )}
        </div>
        <button type="submit" className="btn btn-primary" onClick={tryToLogin}>
          Login
        </button>
        <button
          type="submit"
          className="btn btn-primary to-hello-page-button"
          onClick={backToHomePage}
        >
          <span>Hello</span> Page
        </button>
      </form></div>}
    </React.Fragment>
  );
}

export default LoginPage;
