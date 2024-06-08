import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
// material-ui
import { Avatar, Box, CircularProgress, Grid, InputAdornment, LinearProgress, OutlinedInput, styled, useTheme } from '@mui/material';
// assets
import { BsFillSendFill } from "react-icons/bs";
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {init_prompt, send_prompt, get_user_conversation} from 'store/prompt/actions';

import {AssistantBox, AssistantLoadingBox} from './chatbot/AssistantBox';
import UserBox from './chatbot/UserBox';
// ==============================|| DEFAULT DASHBOARD ||============================== //

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
    const timer = setTimeout(() => {
      setAssistantLoading(false)
    }, 1000)
    return () => {
      clearTimeout(timer)
    }
  }, [messages, isAssistantLoading])

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current._container.scrollTop = scrollRef.current._container.scrollHeight;
    }
  };

  const handleSubmitPrompt = useCallback(() => {
    if (prompt) {
      setAssistantLoading(true)
      dispatch(send_prompt(prompt, conversationId))
      setPrompt('')
    }
  }, [prompt, conversationId])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmitPrompt()
    }
  }

  const renderMessage = (messages) => {
    return messages.filter(item => item.role !== 'system').map((item, index) => {
      return (
        item.role === 'assistant' 
        ? <AssistantBox key={`assistant${index}`} content={item.content}/>
        : <UserBox key={`user${index}`} content={item.content}/>
      )
    })
  }

  return (
    <Grid container sx={{height: '100%', flexDirection: 'column', flexWrap: 'nowrap'}}>
      <PerfectScrollbar ref={scrollRef}>
        <Grid 
          item 
          container
          sx={{display: 'flex', flexWrap: 'wrap', height: chatboxHeight - 10 + 'px', alignContent: 'flex-start'}}
        >
            {renderMessage(messages)}
            <AssistantLoadingBox isAssistantLoading={isAssistantLoading}/>
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
              <BsFillSendFill onClick={handleSubmitPrompt}/>
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
