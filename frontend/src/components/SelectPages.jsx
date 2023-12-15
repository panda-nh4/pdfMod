import React, { useState } from "react";
import PageCard from "./PageCard";
import Grid from "@mui/material/Grid";
import { pdfjs, Document, Page } from "react-pdf";
import { useDispatch, useSelector } from "react-redux";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import SelectedPagesTextComponent from "./SelectedPagesTextComponent";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();
// Component for page selection
const SelectPages = () => {
  const pdfURI = useSelector((state) => state.public.uploadedFileData);
  const dispatch = useDispatch();
  const [pages, setPages] = useState([]);
  const loadedDoc = (numPages) => {
  setPages([...Array(numPages).keys()]);
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
          <h2>Select Pages</h2>
        </div>
        <div style={{width:"90%", padding:"5px"}}>
        <SelectedPagesTextComponent textToDisplay={"Pages selected : "}/>
        </div>
        <div style={{ padding: "10px" }}>
          <Document
            file={pdfURI}
            onLoadSuccess={({ numPages }) => loadedDoc(numPages)}
          >
            <Grid container columns={{ xs: 2, sm: 8, md: 20 }}>
              {pages.map((_, index) => (
                <Grid item xs={2} sm={4} md={4} key={index}>
                  <div
                    style={{
                      padding: "5px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <PageCard index={index} />
                  </div>
                </Grid>
              ))}
            </Grid>
          </Document>
        </div>
      </div>
    </div>
  );
};

export default SelectPages;
