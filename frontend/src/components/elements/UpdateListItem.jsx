import React, { useState, useContext } from "react";
import AuthContext from "../../auth-context";

import { validateValueLength } from "../../checks";

import TextareaAutosize from "react-textarea-autosize";

import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import "../../style/UpdateListNoteItem.css";

function UpdateListItem(props) {
  const authContext = useContext(AuthContext);

  const listId = props.id;

  const [isValidListTitle, setIsValidListTitle] = useState(true);
  const [isSuccessfulUpdate, setIsSuccessfulUpdate] = useState(true);

  const [list, setList] = useState({
    title: props.title,
    description: props.description,
  });

  function updateListInfo(event) {
    const { name, value } = event.target;
    setList((previousValue) => {
      return {
        ...previousValue,
        [name]: value,
      };
    });
  }

  async function updateList(event) {
    event.preventDefault();

    if (!validateValueLength(list.title)) {
      setIsValidListTitle(false);
      return;
    }
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/lists/update/" + listId + "",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authContext.token,
          },
          body: JSON.stringify({
            title: list.title,
            description: list.description,
          }),
        }
      );

      const responseData = await response.json();

      props.setLists((previousValue) => {
        const newLists = previousValue.map((list) => {
          if (list._id === responseData.list._id) {
            list.title = responseData.list.title;
            list.description = responseData.list.description;
          }
          return list;
        });
        return newLists;
      });
    } catch (error) {
      setIsValidListTitle(true);
      setIsSuccessfulUpdate(false);
      return;
    }

    props.setUpdateList((previousValue) => {
      return !previousValue;
    });
  }

  function closeUpdateMenu(event) {
    event.preventDefault();
    props.setUpdateList((previousValue) => {
      return !previousValue;
    });
  }

  return (
    <div>
      <TextareaAutosize
        autoFocus
        className="title"
        name="title"
        placeholder="title"
        onChange={updateListInfo}
        value={list.title}
      ></TextareaAutosize>
      <TextareaAutosize
        autoFocus
        className="text"
        name="description"
        placeholder="description"
        onChange={updateListInfo}
        value={list.description}
      ></TextareaAutosize>
      {isValidListTitle ? null : (
        <div className="warning-div">
          <ErrorIcon className="warning-icon" />
          <p className="warning-text">Title can't be empty!</p>
        </div>
      )}
      {isSuccessfulUpdate ? null : (
        <div className="warning-div">
          <ErrorIcon className="warning-icon" />
          <p className="warning-text">List update failed! Check errors.</p>
        </div>
      )}
      <button className="updateButton" onClick={updateList}>
        <CheckCircleIcon />
      </button>
      <button className="deleteButton" onClick={closeUpdateMenu}>
        <CancelIcon />
      </button>
    </div>
  );
}

export default UpdateListItem;
