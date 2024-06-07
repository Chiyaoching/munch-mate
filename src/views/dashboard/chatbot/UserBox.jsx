import React from 'react'
import { Avatar, Grid, styled, useTheme } from '@mui/material';
import './chatbot.scss'

const commonStyles = {
  display: 'flex',
  flexGrow: 1,
  marginTop: 20,
  marginBottom: 20,
}

const UserContainer = styled(Grid, { shouldForwardProp: (prop) => prop !== 'theme' })(({ theme }) => ({
  ...commonStyles,
  justifyContent: 'end',
  marginRight: 6
}));

const MessageBox = styled(Grid, { shouldForwardProp: (prop) => prop !== 'theme' && prop !== 'isRight'})(({ theme, isRight }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  boxShadow: `2px 2px 3px 1px ${theme.palette.primary.main}`,
  borderRadius: '5px',
  padding: '10px',
  display: 'flex',
  justifyContent: isRight ? 'end': 'start'
}));

const UserBox = React.memo(({content}) => {
  const theme = useTheme();

  return (
    <UserContainer theme={theme} item xs={12}>
      <MessageBox isRight>
        {content}
      </MessageBox>
      <Avatar sx={{width: 30, height: 30, ml: 2}}/>
    </UserContainer>
  )
})

export default UserBox