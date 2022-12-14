import React, { useContext }from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../auth-context";

import errorImage from "../images/error-image.png";

import "../style/ErrorPage.css";

function ErrorPage(){
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    function navigateBack(){
        authContext.userId ? navigate("/user/lists"):navigate("/");
    }

    return(
        <div className="error-page-div">
        <img className="error-image" src={errorImage} alt="errorimage"></img>
        <p className="error-message">{"Something went wrong"}</p>
        <button onClick={navigateBack} id="button-on-error-page" className="btn btn-primary">{authContext.userId ? "Back to Lists": "Back to Hello page"}</button>
        </div>
    )
}

export default ErrorPage;