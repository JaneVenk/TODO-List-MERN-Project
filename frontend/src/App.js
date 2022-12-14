import React, { useState, useCallback, useEffect, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import LoadingSpinner from "./components/elements/LoadingSpinner";

import HomePage from "./components/HomePage";
import AuthContext from "./auth-context";

const LoginPage = React.lazy(()=>import("./components/LoginPage"));
const SignupPage = React.lazy(()=>import("./components/SignupPage"));
const ListsPage = React.lazy(()=>import("./components/ListsPage"));
const NotesPage = React.lazy(()=>import("./components/NotesPage"));
const ErrorPage = React.lazy(()=>import("./components/ErrorPage"));


let logoutTimer;
const oneHourMilliSeconds = 1000 * 60 * 60;

function App() {
  const [userId, setUserId] = useState();
  const [token, setToken] = useState();
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((uid, token, expirationDate) => {
    setUserId(uid);
    setToken(token);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + oneHourMilliSeconds); 
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    setToken(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  const updateTokenExpirationTimer = useCallback(
    (token, tokenExpirationDate) => {
      if (token && tokenExpirationDate) {
        const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout, remainingTime);
      } else {
        clearTimeout(logoutTimer);
      }
    },
    [logout]
  );

  useEffect(() => {
    updateTokenExpirationTimer(token, tokenExpirationDate);
  }, [token, tokenExpirationDate, updateTokenExpirationTimer]);

  const checkUserLoginData = useCallback(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const hasValidDataForLogin = storedData && storedData.token && new Date(storedData.expiration) > new Date();
    
    if (hasValidDataForLogin) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  useEffect(
    function () {
      checkUserLoginData();
    },
    [checkUserLoginData] 
  );

  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<ListsPage />} />
        <Route path="/login" element={<ListsPage />} />
        <Route path="/signup" element={<ListsPage />} />
        <Route path="/user/lists" element={<ListsPage />} />
        <Route path="/list/:listid" element={<NotesPage />} />
        <Route path="/*" element={<ErrorPage />}></Route>
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/*" element={<HomePage />}></Route>
      </Routes>
    );
  }

  return (
    <React.Fragment>
      <AuthContext.Provider
        value={{
          userId: userId,
          token: token,
          login: login,
          logout: logout,
        }}
      >
        <Router>
          <main><Suspense fallback={<div className="center"><LoadingSpinner/></div>}>{routes}</Suspense></main>
        </Router>
      </AuthContext.Provider>
    </React.Fragment>
  );
}

export default App;


