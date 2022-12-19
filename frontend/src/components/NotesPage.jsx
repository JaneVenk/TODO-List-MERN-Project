import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { validateValueLength } from "../checks";

import AuthContext from "../auth-context";
import NoteItem from "./elements/NoteItem";
import MainHeader from "./elements/MainHeader";
import OutsideClick from "./hooks/OutsideClick";
import ErrorPage from "./ErrorPage";

import "../style/ListsNotesPages.css";

import AddIcon from "@mui/icons-material/Add";
import ErrorIcon from "@mui/icons-material/Error";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";

import dogGif from "../images/dog-gif.gif";

function NotesPage() {
  const listId = useParams().listid;

  const authContext = useContext(AuthContext);

  const navigate = useNavigate();

  const [isErrorPage, setIsErrorPage] = useState(false);
  const [listTitle, setListTitle] = useState("");
  const [listColor, setListColor] = useState("");
  const [notes, setNotes] = useState();
  const [newNote, setNewNote] = useState("");
  const [ckickOnAddNewNote, setClickOnAddNewNote] = useState(false);
  const [isValidNote, setIsValidNote] = useState(true);
  const [isSuccessfulAdd, setIsSuccessfulAdd] = useState(true);

  useEffect(
    function () {
      async function sendResponse() {
        try {
          const response = await fetch(
            process.env.REACT_APP_BACKEND_URL + "/notes/" + listId + "",
            {
              headers: { Authorization: "Bearer " + authContext.token },
            }
          );
          const responseData = await response.json();
          setNotes(responseData.notes);
          setListTitle(responseData.listTitle);
          setListColor(responseData.listColor);
        } catch {
          setIsErrorPage(true);
          return;
        }
      }
      sendResponse();
    },
    [listId, authContext.token]
  );

  function updateNewNote(event) {
    const note = event.target.value;
    setNewNote(note);
  }

  async function addNewNote(event) {
    event.preventDefault();

    if (!validateValueLength(newNote)) {
      setIsValidNote(false);
      return;
    }

    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/notes/addnote/" + listId + "",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authContext.token,
          },
          body: JSON.stringify({
            text: newNote,
          }),
        }
      );

      const responseData = await response.json();

      const createdNote = responseData.note;

      setNotes((previousValue) => {
        return [...previousValue, createdNote];
      });
    } catch {
      setIsValidNote(true);
      setIsSuccessfulAdd(false);
      return;
    }

    setNewNote("");

    setIsValidNote(true);

    setClickOnAddNewNote(false);

    setIsSuccessfulAdd(true);
  }

  function clickOnInput() {
    setClickOnAddNewNote(true);
  }

  function backToLists() {
    navigate("/user/lists");
  }

  return (
    <React.Fragment>
      {isErrorPage ? (
        <ErrorPage />
      ) : (
        <div>
          <MainHeader />
          <div className="list-name-div">
            <h1 className="list-name">{listTitle}</h1>
            <button
              onClick={backToLists}
              className="btn btn-primary button-backToLists"
              type="button"
            >
              Back to Lists
            </button>
          </div>

          <div>
            <OutsideClick
              page={"note"}
              setClickOnAddNewNote={setClickOnAddNewNote}
              setNewNote={setNewNote}
              setIsValidNote={setIsValidNote}
            >
              <div className="form-center">
                <form className="create-entry">
                  <textarea
                    rows={ckickOnAddNewNote ? 2 : 1}
                    name="text"
                    placeholder="Add new note..."
                    onChange={updateNewNote}
                    value={newNote}
                    onClick={clickOnInput}
                  ></textarea>

                  {isValidNote ? null : (
                    <div>
                      <ErrorIcon className="warning-icon" />
                      <p className="warning-text">
                        Empty Note! Write something.
                      </p>
                    </div>
                  )}

                  {isSuccessfulAdd ? null : (
                    <div>
                      <ErrorIcon className="warning-icon" />
                      <p className="warning-text">
                        Note add failed! Check errors.
                      </p>
                    </div>
                  )}

                  <Zoom in={ckickOnAddNewNote}>
                    <Fab type="submit" onClick={addNewNote}>
                      <AddIcon />
                    </Fab>
                  </Zoom>
                </form>
              </div>
            </OutsideClick>

            {notes ? (
              notes.length ? (
                <div className="outer-block">
                  <ResponsiveMasonry
                    columnsCountBreakPoints={{
                      350: 1,
                      750: 2,
                      900: 3,
                      1224: 4,
                    }}
                  >
                    <Masonry Masonry gutter={"1.5rem"}>
                      {notes.map((note) => {
                        return (
                          <NoteItem
                            key={note._id}
                            text={note.text}
                            id={note._id}
                            backgroundColor={listColor}
                            setNotes={setNotes}
                          />
                        );
                      })}
                    </Masonry>
                  </ResponsiveMasonry>
                </div>
              ) : (
                <div>
                  <img className="gif-image" src={dogGif} alt="gif"></img>{" "}
                  <p className="no-items-text">No Notes</p>
                </div>
              )
            ) : null}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default NotesPage;
