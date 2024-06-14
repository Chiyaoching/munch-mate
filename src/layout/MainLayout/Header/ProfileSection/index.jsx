import React, { useState, useRef, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// third-party

// project imports
import MainCard from "ui-component/cards/MainCard";
import Transitions from "ui-component/extended/Transitions";

// assets
import { IconLogout, IconSettings } from "@tabler/icons-react";

import { isAuthenticated } from "utils/auth";
import {
  REMOVE_USER_INFO,
  getUserSetting,
  updateUserSetting,
} from "store/user/actions";
import DialogBox from "ui-component/Dialog";
import { Button, FormControl, IconButton, InputLabel } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// ==============================|| PROFILE MENU ||============================== //

const SettingBox = React.memo(({ isOpen, handleClose, handleConfirm }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [apiKey, setApiKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const userSettings = useSelector((state) => state.user.userInfo);

  const handleChange = (e) => setApiKey(e.target.value);
  const handleClick = () => handleConfirm({ apiKey });
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  useEffect(() => {
    if (isOpen) {
      if (userSettings) {
        setApiKey(userSettings?.apiKey);
      }
    }
  }, [isOpen, userSettings]);

  return (
    <DialogBox
      isOpen={isOpen}
      title="Setting"
      handleClose={handleClose}
      buttons={
        <Button variant="outlined" onClick={handleClick}>
          Confirm
        </Button>
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-apikey">API key</InputLabel>
            <OutlinedInput
              id="outlined-adornment-apikey"
              type={showPassword ? "text" : "password"}
              value={apiKey}
              name="apiKey"
              onChange={handleChange}
              label="API key"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              inputProps={{}}
            />
          </FormControl>
        </Grid>
      </Grid>
    </DialogBox>
  );
});

const ProfileSection = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);
  const userInfo = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();

  const [sdm, setSdm] = useState(true);
  const [value, setValue] = useState("");
  const [notification, setNotification] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [openSetting, setOpenSettings] = useState(false);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  const handleLogout = () => {
    dispatch({ type: REMOVE_USER_INFO });
    if (!isAuthenticated()) {
      navigate("/login");
    }
  };

  const handleSettings = () => {
    setOpenSettings(true);
    setOpen(false);
  };

  const handleCloseSetting = () => {
    setOpenSettings(false);
  };

  const handleConfirmSetting = async (values) => {
    try {
      await dispatch(updateUserSetting(values));
      setOpenSettings(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, index, route = "") => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== "") {
      navigate(route);
    }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Avatar
        // src={User1}
        sx={{
          ...theme.typography.mediumAvatar,
          // margin: '8px 0 8px 8px !important',
          cursor: "pointer",
        }}
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="inherit"
      />
      <SettingBox
        isOpen={openSetting}
        handleClose={handleCloseSetting}
        handleConfirm={handleConfirmSetting}
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 14],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  border={false}
                  elevation={16}
                  content={false}
                  boxShadow
                  shadow={theme.shadows[16]}
                >
                  <Box sx={{ p: 2, pb: 0 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4">Hey,</Typography>
                        <Typography
                          component="span"
                          variant="h4"
                          sx={{ fontWeight: 400 }}
                        >
                          {userInfo?.username}
                        </Typography>
                      </Stack>
                      <Typography variant="subtitle2">
                        {userInfo?.email}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Divider />
                    <List
                      component="nav"
                      sx={{
                        width: "100%",
                        maxWidth: 350,
                        minWidth: 300,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: "10px",
                        [theme.breakpoints.down("md")]: {
                          minWidth: "100%",
                        },
                        "& .MuiListItemButton-root": {
                          mt: 0.5,
                        },
                      }}
                    >
                      <ListItemButton
                        sx={{ borderRadius: `${customization.borderRadius}px` }}
                        selected={selectedIndex === 4}
                        onClick={handleSettings}
                      >
                        <ListItemIcon>
                          <IconSettings stroke={1.5} size="1.3rem" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2">Settings</Typography>
                          }
                        />
                      </ListItemButton>

                      <ListItemButton
                        sx={{ borderRadius: `${customization.borderRadius}px` }}
                        selected={selectedIndex === 4}
                        onClick={handleLogout}
                      >
                        <ListItemIcon>
                          <IconLogout stroke={1.5} size="1.3rem" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2">Logout</Typography>
                          }
                        />
                      </ListItemButton>
                    </List>
                  </Box>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
