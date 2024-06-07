import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './chatbot.scss'
// material-ui
import { Avatar, Box, Grid, InputAdornment, OutlinedInput, styled, useTheme } from '@mui/material';
// assets
import { BsFillSendFill } from "react-icons/bs";
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import Logo from '../../assets/images/logo.png'
import { useParams } from 'react-router-dom';
import {init_prompt, send_prompt, get_user_conversation} from 'store/prompt/actions';

import Markdown from 'react-markdown';
// ==============================|| DEFAULT DASHBOARD ||============================== //


const commonStyles = {
  display: 'flex',
  flexGrow: 1,
  marginTop: 20,
  marginBottom: 20,
}

const AssistantBox = styled(Grid, { shouldForwardProp: (prop) => prop !== 'theme' })(({ theme }) => ({
  ...commonStyles,
}));

const UserBox = styled(Grid, { shouldForwardProp: (prop) => prop !== 'theme' })(({ theme }) => ({
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

const Dashboard = () => {
  const {conversationId} = useParams()
  const theme = useTheme();
  const dispatch = useDispatch()
  const messages = useSelector(state => state.prompt.messages)
  const [isLoading, setLoading] = useState(true);
  const [isAssistantLoading, setAssistantLoading] = useState(false);
  const [chatboxHeight, setChatboxHeight] = useState(window.innerHeight - parseInt(theme.typography.mainContent.marginTop, 10) - 51 - 40);
  const [prompt, setPrompt] = useState('');
  const scrollRef = useRef(null)

  const handleResize = useCallback(() => {
    setChatboxHeight(window.innerHeight - parseInt(theme.typography.mainContent.marginTop, 10) - 51 - 40)
  }, [])

  const fetchMessages = async (conversationId) => {
    await dispatch(get_user_conversation(conversationId))
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, []);

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId)
    }
  },[conversationId])

  useEffect(() => {
    scrollToBottom()
    setTimeout(() => {
      setAssistantLoading(false)
    }, 500)
  }, [messages, isAssistantLoading])

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current._container.scrollTop = scrollRef.current._container.scrollHeight;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setAssistantLoading(true)
      dispatch(send_prompt(prompt, conversationId))
      setPrompt('')
    }
  }


  return (
    <Grid container sx={{height: '100%', flexDirection: 'column', flexWrap: 'nowrap'}}>
      <PerfectScrollbar ref={scrollRef}>
        <Grid 
          item 
          container
          sx={{display: 'flex', flexWrap: 'wrap', height: chatboxHeight - 10 + 'px', alignContent: 'flex-start'}}
        >
            {messages.filter(item => item.role !== 'system').map((item, index) => {
              return (
                item.role === 'assistant' 
                ? <AssistantBox theme={theme} item xs={12} key={`assistant${index}`}>
                    <Avatar sx={{width: 30, height: 30}} src={Logo}/>
                    <Box sx={{ml: 2, mt: 0.5, width: '70%', lineHeight: '20px'}}>
                      <Markdown className='markdown-container'>
                        {item.content}
                      </Markdown>
                    </Box>
                  </AssistantBox>
                : <UserBox theme={theme} item xs={12} key={`user${index}`}>
                    <MessageBox isRight>
                      {item.content}
                    </MessageBox>
                    <Avatar sx={{width: 30, height: 30, ml: 2}}/>
                  </UserBox>
              )
            })}
            <AssistantBox theme={theme} item xs={12} sx={{opacity: isAssistantLoading ? '1' : '0'}}>
              <Avatar sx={{width: 30, height: 30}} src={Logo}/>
              <Box sx={{ml: 2, mt: 0.5, width: '70%', lineHeight: '20px'}}>
                Loading...
              </Box>
            </AssistantBox>
        </Grid>
      </PerfectScrollbar>
      <Grid item sx={{width: '70%', marginLeft: 'auto', marginRight: 'auto'}}>
        <OutlinedInput
          sx={{ width: '100%' }}
          id="input-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Set prompt here..."
          onKeyDown={handleKeyDown}
          endAdornment={
            <InputAdornment position="end" sx={{cursor: 'pointer'}}>
              <BsFillSendFill onClick={() => console.log('123')}/>
            </InputAdornment>
          }
          aria-describedby="prompt-input-text"
          inputProps={{
            'aria-label': 'prompt'
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
