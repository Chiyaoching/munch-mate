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

const CustomTitle = styled(DialogTitle)(() => ({
  display: "flex",
  alignItems: "center",
}));
const DialogBox = ({
  isOpen,
  title,
  maxWidth,
  handleClose,
  buttons,
  children,
  className,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <Dialog
      fullWidth
      maxWidth={maxWidth || "md"}
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-content"
    >
      <CustomTitle id="alert-dialog-title">
        <span>{title}</span>
        <Box sx={{ display: "flex", flexGrow: 1 }}></Box>
        <IconButton variant="outlined" onClick={handleClose} autoFocus>
          <RiCloseCircleLine />
        </IconButton>
      </CustomTitle>
      <DialogContent id="alert-dialog-content">
        {children}
        {/* <DialogContentText id="alert-dialog-description">
          Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.
        </DialogContentText> */}
      </DialogContent>
      {buttons && <DialogActions>{buttons}</DialogActions>}
    </Dialog>
  );
};

export default DialogBox;
