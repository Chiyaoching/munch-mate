import React, {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, styled } from '@mui/material';
import { RiCloseCircleLine } from "react-icons/ri";
import { Box, display } from '@mui/system';

const CustomTitle = styled(DialogTitle)(() => ({
  display: 'flex',
  alignItems: 'center',
}))
const AlertDialog = ({isOpenAddDialog, handleClose, children}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isOpenAddDialog);
  }, [isOpenAddDialog])

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-content"
      >
        <CustomTitle id="alert-dialog-title">
          <span>What's the style you're looking for?</span>
          <Box sx={{display: 'flex', flexGrow: 1}}></Box>
          <IconButton variant='outlined' onClick={handleClose} autoFocus>
            <RiCloseCircleLine/>
          </IconButton>
        </CustomTitle>
        <DialogContent id="alert-dialog-content">
          {children}
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
}


export default AlertDialog