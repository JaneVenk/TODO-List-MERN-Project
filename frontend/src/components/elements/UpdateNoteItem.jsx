import React, { useState, useContext } from "react";
import AuthContext from "../../auth-context";

import { validateValueLength } from "../../checks";

import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import TextareaAutosize from "react-textarea-autosize";

import "../../style/UpdateListNoteItem.css";

function UpdateNoteItem(props) {
  const authContext = useContext(AuthContext);

  const noteId = props.id;

  const [isValidNote, setIsValidNote] = useState(true);
  const [isSuccessfulUpdate, setIsSuccessfulUpdate] = useState(true);
  const [noteText, setNoteText] = useState(props.text);

  function updateNoteInfo(event) {
    const newText = event.target.value;
    setNoteText(newText);
  }

  async function updateNote(event) {
    event.preventDefault();

    if (!validateValueLength(noteText)) {
      setIsValidNote(false);
      return;
    }

    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/notes/update/" + noteId + "",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authContext.token,
          },
          body: JSON.stringify({
            text: noteText,
          }),
        }
      );

      const responseData = await response.json();

      props.setNotes((previousValue) => {
        const newNotes = previousValue.map((note) => {
          if (note._id === responseData.note._id) {
            note.text = responseData.note.text;
          }
          return note;
        });
        return newNotes;
      });
    } catch {
      setIsValidNote(true);
      setIsSuccessfulUpdate(false);
      return;
    }
    props.setUpdateNote((previousValue) => {
      return !previousValue;
    });
  }

  function closeUpdateMenu(event) {
    event.preventDefault();
    props.setUpdateNote((previousValue) => {
      return !previousValue;
    });
  }

  return (
    <div>
      <form>
        <TextareaAutosize
          name="text"
          placeholder="note text"
          onChange={updateNoteInfo}
          value={noteText}
          className="text"
        ></TextareaAutosize>
        {isValidNote ? null : (
          <div className="warning-div">
            <ErrorIcon className="warning-icon" />
            <p className="warning-text">Note can't be empty!</p>
          </div>
        )}

        {isSuccessfulUpdate ? null : (
          <div className="warning-div">
            <ErrorIcon className="warning-icon" />
            <p className="warning-text">List update failed! Check errors.</p>
          </div>
        )}

        <button className="updateButton" onClick={updateNote}>
          <CheckCircleIcon />
        </button>
        <button className="deleteButton" onClick={closeUpdateMenu}>
          <CancelIcon />
        </button>
      </form>
    </div>
  );
}

export default UpdateNoteItem;
