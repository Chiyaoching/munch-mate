import React, { useCallback, useContext, useMemo } from "react";
import PropTypes from "prop-types";

// material-ui
import {
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListItemButton,
  ListItemText,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";
import { BrowserView, MobileView } from "react-device-detect";

// project imports
import LogoSection from "../LogoSection";

import { drawerWidth } from "store/constant";
import { RiStickyNoteAddLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { initPrompt } from "store/prompt/actions";
import { useEffect, useRef, useState } from "react";
import DialogBox from "ui-component/Dialog";
import AlertDialog from "ui-component/AlertDialog";
import { SET_ALERT_OPEN } from "store/actions";
// ==============================|| SIDEBAR DRAWER ||============================== //
const MenuListContext = React.createContext({});

const MenuItems = React.memo(
  ({ id, title, createAt, selected, handleNavigate }) => {
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

    // const handleLinkClick = useCallback((e) => {
    //   handleNavigate(e)
    // }, [])

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
  },
);

const MenuList = () => {
  const conversations = useSelector((state) => state.user.conversations);
  const { conversationId } = useContext(MenuListContext);
  const navigate = useNavigate();

  const handleNavigate = useCallback(
    (e) => {
      navigate(`/conversation/${e.currentTarget.dataset.cid}`);
    },
    [navigate],
  );

  return conversations.map((c, index) => {
    return (
      <MenuItems
        key={c._id}
        id={c._id}
        title={`Conversation-${conversations.length - index}`}
        createAt={c.createAt}
        selected={conversationId === c._id}
        handleNavigate={handleNavigate}
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

const images = import.meta.glob(
  "../../../assets/images/persona*.{png,jpg,jpeg,svg}",
);

const ImageTitle = styled(ImageListItemBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  opacity: 0.9,
  color: theme.palette.primary.contrastText,
  ".MuiImageListItemBar-titleWrap": {
    paddingTop: 3,
    paddingBottom: 3,
  },
}));

const ImageBox = ({ item, index, cols, rows, handleClick }) => {
  const theme = useTheme();
  // Find the correct image import
  const imagePath = Object.keys(images).find((path) =>
    path.includes(item.image),
  );

  // Use React state to handle the dynamically imported images
  const [src, setSrc] = useState(null);

  const srcset = useCallback((image, size, rows = 1, cols = 1) => {
    return {
      src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${size * cols}&h=${
        size * rows
      }&fit=crop&auto=format&dpr=2 2x`,
    };
  }, []);

  useEffect(() => {
    if (imagePath) {
      images[imagePath]().then((module) => {
        setSrc(module.default);
      });
    }
  }, [imagePath]);

  // Render the image
  return (
    <ImageListItem
      cols={cols || 1}
      rows={rows || 1}
      onClick={handleClick}
      sx={{ cursor: "pointer" }}
    >
      <img {...srcset(src, 200, rows, cols)} alt={item.image} loading="lazy" />
      <ImageTitle
        theme={theme}
        title={item.name}
        // subtitle={item.name}
      />
    </ImageListItem>
  );
};
const PersonaBox = React.memo(
  ({ isOpenAddDialog, personas, handleClose, handlePersonaClick }) => {
    return (
      <DialogBox
        isOpen={isOpenAddDialog}
        title="What's the style you're looking for?"
        handleClose={handleClose}
      >
        {personas && (
          <ImageList variant="quilted" cols={4} rowHeight={200}>
            {personas.map((item, index) => (
              <ImageBox
                key={item.name}
                item={item}
                index={index}
                cols={index === 0 ? 2 : 1}
                rows={index === 0 ? 2 : 1}
                handleClick={() => handlePersonaClick(index)}
              />
            ))}
          </ImageList>
        )}
      </DialogBox>
    );
  },
);

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
  const dispatch = useDispatch();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const userSettings = useSelector((state) => state.user.userInfo);
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));
  const [isOpenAddDialog, setOpenAddDialog] = useState(false);

  const personas = useMemo(
    () => userSettings?.personas,
    [userSettings?.personas],
  );

  const handleAddConversation = async (type) => {
    if (personas[type]) {
      try {
        const c = await dispatch(initPrompt(2, type));
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
        personas={personas}
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
          <MenuListContext.Provider value={contextValues}>
            <MenuList />
          </MenuListContext.Provider>
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
