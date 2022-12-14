import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../auth-context";

import "../../style/MainHeader.css";

import dogImage from "../../images/dog.png";

function MainHeader(props) {
  const authContext = useContext(AuthContext);

  const navigate = useNavigate();

  function logOutClick() {
    // TODO : logout
    authContext.logout();
    navigate("/");
  }

  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <img className="dog-image" src={dogImage} alt="dogimage"></img>
      <div className="container-fluid">
        <h2 className="navbar-brand application-name"> TODOG List</h2>
        <div className="navbar-nav">
          {authContext.token && (
            <button
              onClick={logOutClick}
              className="btn btn-primary"
              type="button"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default MainHeader;
