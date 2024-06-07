import React from 'react'
import { Avatar, Box, Grid, styled, useTheme } from '@mui/material';
import Logo from 'assets/images/logo.png'
import Markdown from 'react-markdown';
import './chatbot.scss'

const commonStyles = {
  display: 'flex',
  flexGrow: 1,
  marginTop: 20,
  marginBottom: 20,
}

const AssistantContainer = styled(Grid, { shouldForwardProp: (prop) => prop !== 'theme' })(({ theme }) => ({
  ...commonStyles,
}));

export const AssistantBox = React.memo(({content}) => {
  const theme = useTheme();

  return (
    <AssistantContainer theme={theme} item xs={12}>
      <Avatar sx={{width: 30, height: 30}} src={Logo}/>
      <Box sx={{ml: 2, mt: 0.5, width: '70%', lineHeight: '20px'}}>
        <Markdown className='markdown-container'>
          {content}
        </Markdown>
      </Box>
    </AssistantContainer>
  )
})

export const AssistantLoadingBox = React.memo(({isAssistantLoading}) => {
  const theme = useTheme();
  return (
    <AssistantContainer theme={theme} item xs={12} sx={{mb: 2, opacity: isAssistantLoading ? '1' : '0', alignItems: 'center'}}>
      <Avatar sx={{width: 30, height: 30}} src={Logo}/>
      <Box sx={{ml: 2, mt: 0.5, width: '50%'}}>
        <span>Thinking...</span>
        <div className='loader'/>
      </Box>
    </AssistantContainer>
  )
})

export default AssistantBox