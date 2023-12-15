import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Page } from "react-pdf";
import { setSelectedPages } from "../slices/publicSlice";
// Component to render a PDF page in selectPagesScreen. Selecting changes background color to blue
const PageCard = ({ index }) => {
  const selectedPages = useSelector((state) => state.public.selectedPages);
  const borderSelectedColor = selectedPages.includes(index)
    ? { colour: "blue", text: "white",borderColor:"blue" }
    : { colour: "white", text: "black",borderColor:"black" };
  const dispatch = useDispatch();
  const selectEvent = () => {
    if (selectedPages.includes(index)) {
      const idx = selectedPages.indexOf(index);
      if (idx > -1) {
        const arr = selectedPages.filter((item) => item !== index);
        dispatch(setSelectedPages(arr));
      }
    } else {
      dispatch(
        setSelectedPages(
          [...selectedPages, index].sort((a, b) => {
            return a - b;
          })
        )
      );
    }
  };
  return (
    <div
      style={{
        width: "200px",
        height: "300px",
        backgroundColor: borderSelectedColor.colour,
        borderStyle: "solid",
        borderWidth: "4px",
        borderRadius: "5px",
        borderColor: borderSelectedColor.borderColor,
        userSelect: "none",
        cursor: "pointer",
      }}
      onClick={selectEvent}
    >
      <div
        style={{
          height: "90%",
          width: "100%",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <Page pageIndex={index} height={270} width={196} />
      </div>
      <div
        style={{
          width: "100%",
          justifyContent: "center",
          paddingTop: "5px",
          display: "flex",
          color: borderSelectedColor.text,
        }}
      >
        {`Page ${index + 1}`}
      </div>
    </div>
  );
};

export default PageCard;
