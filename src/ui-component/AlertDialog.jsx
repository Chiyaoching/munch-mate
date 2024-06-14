import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, styled } from "@mui/material";
import { RiCloseCircleLine } from "react-icons/ri";
import { Box, display } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { SET_ALERT_OPEN } from "store/actions";
import { LuAlertTriangle } from "react-icons/lu";

const CustomTitle = styled(DialogTitle)(() => ({
  display: "flex",
  alignItems: "center",
}));
const AlertDialog = ({ children }) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.customization.alertOpen);
  const alertMsg = useSelector((state) => state.customization.alertMsg);

  const handleClose = () => {
    dispatch({ type: SET_ALERT_OPEN, alertOpen: !isOpen, alertMsg: "" });
  };

  return (
    <>
      <Dialog
        fullWidth
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-content"
      >
        <CustomTitle id="alert-dialog-title">
          <LuAlertTriangle />
          <span>Oooops!</span>
          <Box sx={{ display: "flex", flexGrow: 1 }}></Box>
          <IconButton variant="outlined" onClick={handleClose} autoFocus>
            <RiCloseCircleLine />
          </IconButton>
        </CustomTitle>
        <DialogContent id="alert-dialog-content">
          {alertMsg}
          {/* <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText> */}
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
};

export default React.memo(AlertDialog);
