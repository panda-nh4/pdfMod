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
  const [view, { isLoading }] = useLazyViewFileQuery();
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
          const res = await view({ fileName: uploadedFileName }).unwrap();
          const resBlob = new Blob([res]);
          const pdfURI = URL.createObjectURL(resBlob);
          dispatch(setUploadedFileData(pdfURI));

          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } catch (err) {
          if (err.status === 500) toast.error("Network Error");
          else toast.error(err?.data?.message || err.error);
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
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    dispatch(resetPublicState());
    setActiveStep(0);
    navigate("/");
  };

  return (
    <div style={{width:"100%"}}>
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
          <div>
            <Button onClick={handleReset}>
              Start Again
            </Button>
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
                disabled={activeStep === 0}
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
