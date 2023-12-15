import { Stepper } from "@mui/material";
import { Step } from "@mui/material";
import { StepLabel } from "@mui/material";
import { Button } from "@mui/material";
import { useState } from "react";
import UploadComponent from "../components/UploadComponent";
import SelectPages from "../components/SelectPages";
import ReorderComponent from "../components/ReorderComponent";
import DownloadComponent from "../components/DownloadComponent";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLazyViewFileQuery } from "../slices/publicApiSlice";
import { resetPublicState, setUploadedFileData } from "../slices/publicSlice";
import { useNavigate } from "react-router-dom";

function getSteps() {
  return ["Upload", "Select Pages", "Re-order Pages", "Done"];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <UploadComponent />;
    case 1:
      return <SelectPages />;
    case 2:
      return <ReorderComponent />;
    case 3:
      return <DownloadComponent />;
    default:
      return "Unknown step";
  }
}
const ProcessScreen = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const dispatch = useDispatch();
  const [view] = useLazyViewFileQuery();
  const selectedPages = useSelector((state) => state.public.selectedPages);
  const uploadedFileName = useSelector(
    (state) => state.public.uploadedFileName
  );
  const navigate = useNavigate();

  const downloadLink = useSelector((state) => state.public.downloadLink);
  const disableDownload =
    activeStep === steps.length - 1 ? (downloadLink ? false : true) : false; // used to disable buttons based on whether download link has been generated
  const handleNext = async () => {
    if (activeStep == 0) {
      if (uploadedFileName === null) {  // Check if dile has been uploaded
        toast.error("Upload file first");
      } else {
        try {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          const res = await view({ fileName: uploadedFileName }).unwrap();  // Get uploaded file from server
          const resBlob = new Blob([res]);  // Store uploaded file as blob
          const pdfURI = URL.createObjectURL(resBlob);  // Create a link to the blob
          dispatch(setUploadedFileData(pdfURI));  
        } catch (err) {
          if (err.status >= 500) toast.error("Server Error");
          else {
            if (err.status === 401)
              toast.error("Unauthorised. Login in first.");
            else
              toast.error(
                err?.data?.message || err.error || `${err.status} Error`
              );
          }
        }
      }
    } else if (activeStep == 1) {
      if (selectedPages === null || selectedPages.length === 0) // check if at least 1 page is selected
        toast.error("Select at least one page.");
      else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else if (activeStep == 2) {
      if (selectedPages === null || selectedPages.length === 0) // check if at least 1 page is selected
        toast.error("Select at least one page.");
      else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else if (activeStep == 3) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      window.open(downloadLink, "_blank");  // open generated pdf file link in new tab 
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    dispatch(resetPublicState());
    setActiveStep(0);
    navigate("/");
  };

  return (
    <div style={{ width: "100%", }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              marginTop: "1%",
              borderRadius: "10px",
              backgroundColor: "#d90940",
              color: "white",
              fontFamily: "Roboto",
            }}
          >
            <div
              style={{
                justifyContent: "center",
                display: "flex",
              }}
            >
              <h2>
                Congrats on modifying the PDF. Click below to modify
                another one.
              </h2>
            </div>

            <div
              style={{
                padding: "20px",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Button
                onClick={handleReset}
                style={{ backgroundColor: "white" }}
              >
                Start Again
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "5px",
              }}
            >
              <Button
                disabled={activeStep === 0 || !disableDownload}
                onClick={handleBack}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={disableDownload}
                >
                  Download
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </div>
            <div>{getStepContent(activeStep)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessScreen;
