import React, { useState, useEffect, useContext } from "react";

import AuthContext from "../auth-context";
import ListItem from "./elements/ListItem";
import MainHeader from "./elements/MainHeader";
import OutsideClick from "./hooks/OutsideClick";
import ErrorPage from "./ErrorPage";

import { validateValueLength } from "../checks";

import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import Masonry from "@mui/lab/Masonry";
import ErrorIcon from "@mui/icons-material/Error";

import "../style/ListsNotesPages.css";

import dogGif from "../images/dog-gif.gif";

function ListsPage() {
  const authContext = useContext(AuthContext);

  const [ckickOnAddNewList, setClickOnAddNewList] = useState(false);
  const [isValidNewListTitle, setIsValidNewListTitle] = useState(true);
  const [isErrorPage, setIsErrorPage] = useState(false);
  const [isSuccessfulAdd, setIsSuccessfulAdd] = useState(true);
  const [lists, setLists] = useState();

  const [newList, setNewList] = useState({
    title: "",
    description: "",
  });

  const userId = authContext.userId;

  function randomBackgroundColor() {
    return "hsla(" + ~~(360 * Math.random()) + "," + "70%," + "80%,1)";
  }

  useEffect(
    function () {
      async function sendResponse() {
        try {
          const response = await fetch(
            process.env.REACT_APP_BACKEND_URL + "/lists/" + userId + "",
            {
              headers: { Authorization: "Bearer " + authContext.token },
            }
          );
          const responseData = await response.json();
          setLists(responseData.lists);
        } catch {
          setIsErrorPage(true);
          return;
        }
      }
      sendResponse();
    },
    [userId, authContext.token]
  );

  function updateNewList(event) {
    const { name, value } = event.target;

    setNewList((previousValue) => {
      return {
        ...previousValue,
        [name]: value,
      };
    });
  }

  async function addNewList(event) {
    event.preventDefault();

    if (!validateValueLength(newList.title)) {
      setIsValidNewListTitle(false);
      return;
    }

    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/lists/addlist/" + userId + "",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authContext.token,
          },
          body: JSON.stringify({
            title: newList.title,
            description: newList.description,
            color: randomBackgroundColor(),
          }),
        }
      );

      const responseData = await response.json();

      const createdList = responseData.list;

      setLists((previousValue) => {
        return [...previousValue, createdList];
      });
    } catch {
      setIsValidNewListTitle(true);
      setIsSuccessfulAdd(false);
      return;
    }

    setNewList({
      title: "",
      description: "",
    });

    setIsSuccessfulAdd(true);

    setIsValidNewListTitle(true);

    setClickOnAddNewList(false);
  }

  function clickOnTextArea() {
    setClickOnAddNewList(true);
  }

  return (
    <React.Fragment>
      {isErrorPage ? (
        <ErrorPage />
      ) : (
        <div>
          <MainHeader />
          <div>
            <OutsideClick
              page={"list"}
              setClickOnAddNewList={setClickOnAddNewList}
              setNewList={setNewList}
              setIsValidNewListTitle={setIsValidNewListTitle}
            >
              <form className="create-entry">
                {ckickOnAddNewList ? (
                  <input
                    name="title"
                    placeholder="Title"
                    onChange={updateNewList}
                    value={newList.title}
                  ></input>
                ) : null}

                <textarea
                  rows={ckickOnAddNewList ? "3" : "1"}
                  name="description"
                  placeholder={
                    ckickOnAddNewList ? "Description" : "Add new list..."
                  }
                  onChange={updateNewList}
                  value={newList.description}
                  onClick={clickOnTextArea}
                ></textarea>

                {isValidNewListTitle ? null : (
                  <div>
                    <ErrorIcon className="warning-icon" />
                    <p className="warning-text">
                      Empty Title! Write something.
                    </p>
                  </div>
                )}

                {isSuccessfulAdd ? null : (
                  <div>
                    <ErrorIcon className="warning-icon" />
                    <p className="warning-text">
                      List add failed! Check errors.
                    </p>
                  </div>
                )}

                <Zoom in={ckickOnAddNewList}>
                  <Fab type="submit" onClick={addNewList}>
                    <AddIcon />
                  </Fab>
                </Zoom>
              </form>
            </OutsideClick>

            {lists ? (
              lists.length ? (
                <div className="outer-block">
                  <Masonry style={{ margin: 0 }} spacing={4}>
                    {lists.map((list) => {
                      return (
                        <ListItem
                          key={list._id}
                          id={list._id}
                          title={list.title}
                          description={list.description}
                          backgroundColor={list.color}
                          setLists={setLists}
                        />
                      );
                    })}
                  </Masonry>
                </div>
              ) : (
                <div>
                  <img className="gif-image" src={dogGif} alt="gif"></img>
                  <p className="no-items-text">No Lists</p>
                </div>
              )
            ) : null}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default ListsPage;
