import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

function OutsideClick(props) {
  function useOutsideClick(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          if (props.page === "list") {
            props.setClickOnAddNewList(false);
            props.setNewList({
              title: "",
              description: "",
            });
            props.setIsValidNewListTitle(true);
          }

          if (props.page === "note") {
            props.setClickOnAddNewNote(false);
            props.setNewNote("");
            props.setIsValidNote(true);
          }
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideClick(wrapperRef);

  return <div ref={wrapperRef}>{props.children}</div>;
}

OutsideClick.propTypes = {
  children: PropTypes.element.isRequired,
};

export default OutsideClick;
