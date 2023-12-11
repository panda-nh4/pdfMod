import { Stepper } from "@mui/material";
import { Step } from "@mui/material";
import { StepLabel } from "@mui/material";
import { Button } from "@mui/material";
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import UploadComponent from "../components/UploadComponent";
import SelectPages from "../components/SelectPages";
import ReorderComponent from "../components/ReorderComponent";
import DownloadComponent from "../components/DownloadComponent";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLazyViewFileQuery } from "../slices/publicApiSlice";
import { setUploadedFileData } from "../slices/publicSlice";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

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
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const dispatch = useDispatch();
  const [view, { isLoading }] = useLazyViewFileQuery();
  const selectedPages = useSelector((state) => state.public.selectedPages);
  const uploadedFileName = useSelector(
    (state) => state.public.uploadedFileName
  );
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
      console.log("Reorder part");
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep == 3) {
      console.log("Download part");
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
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
            <Button
              onClick={handleReset}
              className={classes.button}
              component={Link}
              to="/"
            >
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
                className={classes.button}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
            <div>{getStepContent(activeStep)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessScreen;
