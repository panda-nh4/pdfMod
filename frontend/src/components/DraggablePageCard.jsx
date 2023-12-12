import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Page } from "react-pdf";
import { setSelectedPages } from "../slices/publicSlice";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../ItemTypes";
const DraggablePageCard = ({ index, value }) => {
  const dispatch = useDispatch();
  const selectedPages = useSelector((state) => state.public.selectedPages);
  const onDropped = (dropRes) => {
    let temp = [...selectedPages];
    const dragIndex=selectedPages.indexOf(value)
    const dropIndex=selectedPages.indexOf(dropRes)
    console.log(temp);
    console.log(`Dropping ${value} into ${dropRes}`);
    temp.splice(dragIndex, 1);
    temp.splice(dropIndex, 0, value);
    console.log(temp);
    dispatch(setSelectedPages(temp));
  };
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PAGE,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropRes = monitor.getDropResult();
      if (item && dropRes) {
        if (value !== dropRes.value) onDropped(dropRes.value);
        else {
          console.log("Not ");
          console.log(value);
        }
      }
    },
  }),[selectedPages]);
  return (
    <div
      ref={drag}
      style={{
        width: "200px",
        height: "300px",
        backgroundColor: "white",
        borderStyle: "solid",
        borderWidth: "4px",
        borderRadius: "5px",
        borderColor: "black",
        userSelect: "none",
        cursor: "pointer",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div
        style={{
          height: "90%",
          width: "100%",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <Page pageIndex={value} height={270} width={196} />
      </div>
      <div
        style={{
          width: "100%",
          justifyContent: "center",
          paddingTop: "5px",
          display: "flex",
          color: "black",
        }}
      >
        {`Page ${index+1}`}
      </div>
    </div>
  );
};

export default DraggablePageCard;
