import React from "react";
import SelectedPagesTextComponent from "./SelectedPagesTextComponent";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import { pdfjs, Document, Page } from "react-pdf";
import PageCard from "./PageCard";
import DraggablePageCard from "./DraggablePageCard";
import DraggablePageCardHolder from "./DraggablePageCardHolder";
import { Button, TextField } from "@mui/material";
import { setSelectedPages } from "../slices/publicSlice";
import { toast } from "react-toastify";
const ReorderComponent = () => {
  const pdfURI = useSelector((state) => state.public.uploadedFileData);
  const selectedPages = useSelector((state) => state.public.selectedPages);
  const dispatch = useDispatch();
  const getSelectedPagesText = () => {
    if (selectedPages === null) return "";
    var stringArr = "";
    if (selectedPages.length === 0) return "";
    selectedPages.map((_) => (stringArr = stringArr + `${_ + 1} `));
    return stringArr;
  };
  var textVal = getSelectedPagesText();
  const validateString = () => {
    textVal = textVal.trim();
    const nums = textVal.split(" ");
    try {
      for (let i = 0; i < nums.length; i++) {
        nums[i] = parseInt(nums[i]) - 1;
      }
      var res = nums.every(function (element) {
        return typeof element === "number" && selectedPages.includes(element);
      });
      if (res && nums.length===selectedPages.length) {
        // console.log((selectedPages));
        if (
          Math.max(...nums) <= Math.max(...selectedPages) &&
          Math.min(...nums) >= 0
        )
          dispatch(setSelectedPages(nums));
        else {
          toast.error("Invalid page numbers");
        }
      } else {
        toast.error("Invalid page numbers");
      }
    } catch {
      toast.error("Invalid page numbers");
    }
  };
  const setTextVal = (e) => {
    textVal = e.target.value;
  };
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#d90940",
        color: "white",
        fontFamily: "Roboto",
        borderRadius: "10px",
        display: "flex",
      }}
    >
      <div style={{ width: "100%" }}>
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            width: "100%",
          }}
        >
          <h2>Reorder Pages</h2>
        </div>
        <div style={{ width: "90%", padding: "5px" }}>
          <h4 style={{ marginLeft: "20px" }}>
            Drag and drop to reorder or enter space separated values.
          </h4>
          <div
            style={{
              justifyContent: "start",
              marginLeft: "20px",
              display: "flex",
              width: "100%",
              alignItems: "center",
            }}
          >
            <h4>{`Current page order : ${getSelectedPagesText()}`}</h4>
          </div>
          <TextField
            variant="standard"
            onChange={setTextVal}
            label={"Enter new order"}
            style={{
              marginLeft: "20px",
              width: "250px",
            }}
          />
          <Button
            onClick={() => validateString()}
            style={{
              backgroundColor: "white",
              margin: "10px",
              height: "40px",
              width: "100px",
            }}
          >
            Reorder
          </Button>
        </div>
        <div style={{ padding: "10px" }}>
          <Document file={pdfURI}>
            <Grid container columns={{ xs: 2, sm: 8, md: 24 }}>
              {selectedPages.map((_, index) => (
                <Grid item xs={2} sm={4} md={4} key={index}>
                  <DraggablePageCardHolder index={index} value={_} />
                </Grid>
              ))}
            </Grid>
          </Document>
        </div>
      </div>
    </div>
  );
};

export default ReorderComponent;
