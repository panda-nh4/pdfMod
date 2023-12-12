import React from "react";
import { useSelector } from "react-redux";
const SelectedPagesTextComponent = ({textToDisplay}) => {
  const selectedPages = useSelector((state) => state.public.selectedPages);
  const getSelectedPagesText = () => {
    if (selectedPages === null) return "";
    var stringArr = "";
    if (selectedPages.length===0)
    return "No pages selected"
    selectedPages.map((_) => (stringArr = stringArr + `${(_+1)} `));
    return stringArr;
  };
  return (
    <div
      style={{
        justifyContent: "start",
        marginLeft: "20px",
        display: "flex",
        width: "100%",
      }}
    >
      <h4>{`${textToDisplay} ${getSelectedPagesText()}`}</h4>
    </div>
  );
};

export default SelectedPagesTextComponent;
