import React, { useState, useContext } from "react";
import UpdateListItem from "./UpdateListItem";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../auth-context";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorIcon from "@mui/icons-material/Error";

import "../../style/ListNoteItem.css";
import "../../style/ListsNotesPages.css";

function ListItem(props) {
  const authContext = useContext(AuthContext);

  const navigate = useNavigate();

  const [updateList, setUpdateList] = useState(false);
  const [isSuccessfulDelete, setIsSuccessfulDelete] = useState(true);

  const backgroundColor = {
    background: props.backgroundColor,
  };

  async function deleteList(event) {
    event.preventDefault();
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/lists/delete/" + props.id + "",
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

    props.setLists((previousValue) => {
      const newLists = previousValue.filter((list) => list._id !== props.id);
      return newLists;
    });
  }

  function openUpdateListMenu() {
    setUpdateList(!updateList);
  }

  function navigateToNotesPage() {
    navigate("/list/" + props.id + "");
  }

  return (
    <div className="item" style={backgroundColor}>
      {updateList ? (
        <UpdateListItem
          title={props.title}
          description={props.description}
          id={props.id}
          setUpdateList={setUpdateList}
          setLists={props.setLists}
        />
      ) : (
        <div>
          <div className="item-info" onClick={navigateToNotesPage}>
            <h1>{props.title}</h1>
            <p>{props.description}</p>
          </div>

          {isSuccessfulDelete ? null : (
            <div>
              <ErrorIcon className="warning-icon" />
              <p className="warning-text">List delete failed! Check errors.</p>
            </div>
          )}

          <button className="deleteButton" onClick={deleteList}>
            <DeleteIcon />
          </button>
          <button className="updateButton" onClick={openUpdateListMenu}>
            <EditIcon />
          </button>
        </div>
      )}
    </div>
  );
}

export default ListItem;
