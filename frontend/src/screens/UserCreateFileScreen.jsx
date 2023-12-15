import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyUserViewFileQuery } from "../slices/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { Stepper } from "@mui/material";
import { Step } from "@mui/material";
import { StepLabel } from "@mui/material";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import UploadComponent from "../components/UploadComponent";
import SelectPages from "../components/SelectPages";
import ReorderComponent from "../components/ReorderComponent";
// Similar to Process Screen
import {
  resetDownloadLink,
  resetPublicState,
  setUploadedFileData,
} from "../slices/publicSlice";
import UserDownloadComponent from "../components/UserDownloadComponent";
import UnauthorisedScreen from "./UnauthorisedScreen";

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
      return <UserDownloadComponent />;
    default:
      return "Unknown step";
  }
}

const UserCreateFile = () => {
  const name = useSelector((state) => state.user.name);
  if (!name) return <UnauthorisedScreen />;
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const dispatch = useDispatch();
  const [view] = useLazyUserViewFileQuery();
  const selectedPages = useSelector((state) => state.public.selectedPages);
  const uploadedFileName = useSelector(
    (state) => state.public.uploadedFileName
  );

  const navigate = useNavigate();
  const downloadLink = useSelector((state) => state.public.downloadLink);
  const disableDownload =
    activeStep === steps.length - 1 ? (downloadLink ? false : true) : false;

  const handleNext = async () => {
    if (activeStep == 0) {
      if (uploadedFileName === null) {
        toast.error("Upload file first");
      } else {
        try {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          const res = await view({ fileName: uploadedFileName }).unwrap();
          const resBlob = new Blob([res]);
          const pdfURI = URL.createObjectURL(resBlob);
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
      if (selectedPages === null || selectedPages.length === 0)
        toast.error("Select at least one page.");
      else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else if (activeStep == 2) {
      if (selectedPages === null || selectedPages.length === 0)
        toast.error("Select at least one page.");
      else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else if (activeStep == 3) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      window.open(downloadLink, "_blank");
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handleBack = () => {
    if (activeStep == 3) {
      dispatch(resetDownloadLink());
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    dispatch(resetPublicState());
    setActiveStep(0);
    navigate("/");
  };
  return (
    <div style={{ width: "100%", margin: "5px" }}>
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
        {
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "5px",
              }}
            >
              <Button
                disabled={activeStep === 0 || disableDownload}
                onClick={handleBack}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleReset}
                >
                  Home
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
        }
      </div>
    </div>
  );
};

export default UserCreateFile;
