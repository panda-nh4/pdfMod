import React from "react";
import DraggablePageCard from "./DraggablePageCard";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../ItemTypes";
import { useSelector } from "react-redux";
const DraggablePageCardHolder = ({ index, value }) => {
    const selectedPages = useSelector((state) => state.public.selectedPages);
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.PAGE,
    drop: () => ({ value: value }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }),[selectedPages]);
  return (
    <div
      ref={drop}
      style={{
        padding: "5px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <DraggablePageCard index={index} value={value} />
    </div>
  );
};

export default DraggablePageCardHolder;
