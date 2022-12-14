import React, { useState, useContext } from "react";

import UpdateNoteItem from "./UpdateNoteItem";
import AuthContext from "../../auth-context";

import "../../style/ListNoteItem.css";
import "../../style/ListsNotesPages.css";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorIcon from "@mui/icons-material/Error";

function NoteItem(props) {
  const authContext = useContext(AuthContext);
  const [updateNote, setUpdateNote] = useState(false);
  const [isSuccessfulDelete, setIsSuccessfulDelete] = useState(true);

  const backgroundColor = {
    background: props.backgroundColor,
  };

  async function deleteNote(event) {
    event.preventDefault();
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/notes/delete/" + props.id + "",
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + authContext.token },
        }
      );
      const codeStatus = response.status;
      if (codeStatus !== 200) {
        throw new Error(
          "status code for the fetch delete note request is " + codeStatus + ""
        );
      }
    } catch (error) {
      console.log(error);
      setIsSuccessfulDelete(false);
      return;
    }
    props.setNotes((previousValue) => {
      const newNotes = previousValue.filter((note) => note._id !== props.id);
      return newNotes;
    });
  }

  function openUpdateNoteMenu(event) {
    event.preventDefault();
    setUpdateNote(!updateNote);
  }

  return (
    <div className="item" style={backgroundColor}>
      {updateNote ? (
        <UpdateNoteItem
          id={props.id}
          text={props.text}
          setUpdateNote={setUpdateNote}
          setNotes={props.setNotes}
        />
      ) : (
        <div>
          <p>{props.text}</p>
          {isSuccessfulDelete ? null : (
            <div>
              <ErrorIcon className="warning-icon" />
              <p className="warning-text">Note delete failed! Check errors.</p>
            </div>
          )}
          <button className="deleteButton" onClick={deleteNote}>
            <DeleteIcon />
          </button>
          <button className="updateButton" onClick={openUpdateNoteMenu}>
            <EditIcon />
          </button>
        </div>
      )}
    </div>
  );
}

export default NoteItem;
