import React from 'react'
import PropTypes from 'prop-types';

// material-ui
import { Button, Grid, IconButton, ListItemButton, ListItemIcon, ListItemText, Typography, styled, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import { BrowserView, MobileView } from 'react-device-detect';

// project imports
import MenuCard from './MenuCard';
// import MenuList from './MenuList';
import LogoSection from '../LogoSection';
import Chip from 'ui-component/extended/Chip';

import { drawerWidth } from 'store/constant';
import { RiStickyNoteAddLine } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { init_prompt } from 'store/prompt/actions';
import { get_user_conversations } from 'store/user/actions';
import { useEffect, useRef, useState } from 'react';
import AlertDialog from 'ui-component/Dialog';
import MainCard from 'ui-component/cards/MainCard';
import {PERSONAS} from 'store/constant'
// ==============================|| SIDEBAR DRAWER ||============================== //

const MenuList = () => {
  const navigate = useNavigate()
  const {conversationId} = useParams()
  const conversations = useSelector(state => state.user.conversations)

  return conversations.map((c, index) => {
    return (
      <ListItemButton
        sx={{py: 0.5, my: 0.5, borderRadius: '12px'}}
        key={c._id}
        selected={conversationId === c._id}
        onClick={() => navigate(`/conversation/${c._id}`)}
      >
        <ListItemText
          sx={{my: 0}}
          primary={
            <Typography color="inherit">
              {`Conversation-${conversations.length - index}`}
            </Typography>
          }
          secondary={
            c.createAt && (
              <Typography variant="caption" display="block" gutterBottom sx={{fontSize: 10}}>
                {new Date(c.createAt).toLocaleString()}
              </Typography>
            )
          }
        />
      </ListItemButton>
    )
  })
}

const AddButton = ({handleClick}) => {
  return (
    <Box sx={{display: 'flex', justifyContent: 'end'}}>
      <IconButton variant='outlined' onClick={handleClick}>
        <RiStickyNoteAddLine/>
      </IconButton>
    </Box>
  )
}

const PersonaCard = styled(MainCard)(() => ({
  width: '150px',
  height: '150px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
}))

const PersonaBox = React.memo(({isOpenAddDialog, handleClose, handlePersonaClick}) => {
  return (
    <AlertDialog isOpenAddDialog={isOpenAddDialog} handleClose={handleClose}>
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
    </AlertDialog>
  )
})

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const [isOpenAddDialog, setOpenAddDialog] = useState(false)
  const handleAddConversation = async (type) => {
    console.log(type, PERSONAS[type])
    if (PERSONAS[type]) {
      const c = await dispatch(init_prompt(PERSONAS[type]))
      await dispatch(get_user_conversations())
      navigate(`/conversation/${c.conversationId}`)
    }
  }

  const drawer = (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Box sx={{ display: 'flex', p: 2, mx: 'auto' }}>
          <LogoSection />
        </Box>
      </Box>
      <BrowserView>
        <PersonaBox 
          isOpenAddDialog={isOpenAddDialog} 
          handleClose={() => setOpenAddDialog(false)}
          handlePersonaClick={(type) => {
            handleAddConversation(type);
            setOpenAddDialog(false)
          }}
        />
        <PerfectScrollbar
          component="div"
          style={{
            height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 88px)',
            paddingLeft: '16px',
            paddingRight: '16px'
          }}
        >
          <AddButton handleClick={() => setOpenAddDialog(true)}/>
          <MenuList />
          {/* <MenuCard /> */}
          {/* <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
            <Chip label={import.meta.env.VITE_APP_VERSION} disabled chipcolor="secondary" size="small" sx={{ cursor: 'pointer' }} />
          </Stack> */}
        </PerfectScrollbar>
      </BrowserView>
      <MobileView>
        <Box sx={{ px: 2 }}>
          {/* <MenuList /> */}
          {/* <MenuCard /> */}
          {/* <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
            <Chip label={import.meta.env.VITE_APP_VERSION} disabled chipcolor="secondary" size="small" sx={{ cursor: 'pointer' }} />
          </Stack> */}
        </Box>
      </MobileView>
    </>
  );

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto' }} aria-label="mailbox folders">
      <Drawer
        container={container}
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRight: 'none',
            [theme.breakpoints.up('md')]: {
              top: '88px'
            }
          }
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
  window: PropTypes.object
};

export default Sidebar;
