import React, { useCallback, useContext, useMemo } from "react";
import PropTypes from "prop-types";

// material-ui
import {
  Button,
  Grid,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";
import { BrowserView, MobileView } from "react-device-detect";

// project imports
import MenuCard from "./MenuCard";
// import MenuList from './MenuList';
import LogoSection from "../LogoSection";
import Chip from "ui-component/extended/Chip";

import { drawerWidth } from "store/constant";
import { RiStickyNoteAddLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { initPrompt } from "store/prompt/actions";
import { getUserConversations } from "store/user/actions";
import { useEffect, useRef, useState } from "react";
import DialogBox from "ui-component/Dialog";
import MainCard from "ui-component/cards/MainCard";
import { PERSONAS } from "store/constant";
import AlertDialog from "ui-component/AlertDialog";
import { SET_ALERT_OPEN } from "store/actions";
// ==============================|| SIDEBAR DRAWER ||============================== //
const MenuListContext = React.createContext({});

const MenuItems = React.memo(({ id, title, createAt, selected }) => {
  const navigate = useNavigate();

  const handleNavigate = (e) => {
    navigate(`/conversation/${e.currentTarget.dataset.cid}`);
  };

  const dateLabel = useCallback(
    (createAt) => (
      <Typography
        variant="caption"
        display="block"
        gutterBottom
        sx={{ fontSize: 10, opacity: createAt ? 1 : 0 }}
      >
        {new Date(createAt).toLocaleString()}
      </Typography>
    ),
    [],
  );

  const titleLabel = useCallback(
    (title) => <Typography color="inherit">{title}</Typography>,
    [],
  );

  return (
    <ListItemButton
      sx={{ py: 0.5, my: 0.5, borderRadius: "12px" }}
      selected={selected}
      data-cid={id}
      onClick={handleNavigate}
    >
      <ListItemText
        sx={{ my: 0 }}
        primary={titleLabel(title)}
        secondary={dateLabel(createAt)}
      />
    </ListItemButton>
  );
});

const MenuList = () => {
  const conversations = useSelector((state) => state.user.conversations);
  const { conversationId } = useContext(MenuListContext);

  return conversations.map((c, index) => {
    return (
      <MenuItems
        key={c._id}
        id={c._id}
        title={`Conversation-${conversations.length - index}`}
        createAt={c.createAt}
        selected={conversationId === c._id}
      />
    );
  });
};

const AddButton = ({ handleClick }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "end" }}>
      <IconButton variant="outlined" onClick={handleClick}>
        <RiStickyNoteAddLine />
      </IconButton>
    </Box>
  );
};

const PersonaCard = styled(MainCard)(() => ({
  width: "150px",
  height: "150px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
}));

const PersonaBox = React.memo(
  ({ isOpenAddDialog, handleClose, handlePersonaClick }) => {
    return (
      <DialogBox
        isOpen={isOpenAddDialog}
        title="What's the style you're looking for?"
        handleClose={handleClose}
      >
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <PersonaCard border onClick={() => handlePersonaClick(0)}>
              <Box>Type 1</Box>
            </PersonaCard>
          </Grid>
          <Grid item xs={4}>
            <PersonaCard border onClick={() => handlePersonaClick(1)}>
              <Box>Type 2</Box>
            </PersonaCard>
          </Grid>
          <Grid item xs={4}>
            <PersonaCard border onClick={() => handlePersonaClick(2)}>
              <Box>Type 3</Box>
            </PersonaCard>
          </Grid>
        </Grid>
      </DialogBox>
    );
  },
);

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
  const dispatch = useDispatch();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));
  const [isOpenAddDialog, setOpenAddDialog] = useState(false);

  const handleAddConversation = async (type) => {
    if (PERSONAS[type]) {
      try {
        const c = await dispatch(initPrompt(PERSONAS[type]));
        // await dispatch(getUserConversations())
        navigate(`/conversation/${c.conversationId}`);
      } catch (err) {
        console.log(err);
        dispatch({
          type: SET_ALERT_OPEN,
          alertOpen: true,
          alertMsg: err.response.data || err.message,
        });
      }
    }
  };

  const handleOpenAddDialog = useCallback(() => setOpenAddDialog(true), []);
  const handleCloseAddDialog = useCallback(() => setOpenAddDialog(false), []);
  const handlePersonaClick = (type) => {
    handleAddConversation(type);
    setOpenAddDialog(false);
  };
  const contextValues = useMemo(() => ({ conversationId }), [conversationId]);

  const drawer = (
    <>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Box sx={{ display: "flex", p: 2, mx: "auto" }}>
          <LogoSection />
        </Box>
      </Box>
      <PersonaBox
        isOpenAddDialog={isOpenAddDialog}
        handleClose={handleCloseAddDialog}
        handlePersonaClick={handlePersonaClick}
      />
      <BrowserView>
        <AlertDialog />
        <PerfectScrollbar
          component="div"
          style={{
            height: !matchUpMd ? "calc(100vh - 56px)" : "calc(100vh - 88px)",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          <AddButton handleClick={handleOpenAddDialog} />
          <MenuListContext.Provider value={contextValues}>
            <MenuList />
          </MenuListContext.Provider>
        </PerfectScrollbar>
      </BrowserView>
      <MobileView>
        <Box sx={{ px: 2 }}>
          <AddButton handleClick={handleOpenAddDialog} />
          <MenuList conversationId={conversationId} />
        </Box>
      </MobileView>
    </>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : "auto" }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant={matchUpMd ? "persistent" : "temporary"}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRight: "none",
            [theme.breakpoints.up("md")]: {
              top: "88px",
            },
          },
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func,
  window: PropTypes.object,
};

export default Sidebar;
