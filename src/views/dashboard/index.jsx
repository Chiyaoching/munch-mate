import { useCallback, useEffect, useRef, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';

import { gridSpacing } from 'store/constant';
import {init_prompt, send_prompt} from 'store/prompt/actions';
// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import { Avatar, Box, Button, InputAdornment, OutlinedInput, styled, useTheme } from '@mui/material';
import { BsFillSendFill } from "react-icons/bs";
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import Logo from '../../assets/images/logo.png'
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch()
  const messages = useSelector(state => state.prompt.messages)
  const [isLoading, setLoading] = useState(true);
  const [chatboxHeight, setChatboxHeight] = useState(window.innerHeight - parseInt(theme.typography.mainContent.marginTop, 10) - 51 - 40);
  const [prompt, setPrompt] = useState('');
  const chatbox = useRef(null)
  const dialogBox = useRef(null)

  const handleResize = useCallback(() => {
    setChatboxHeight(window.innerHeight - parseInt(theme.typography.mainContent.marginTop, 10) - 51 - 40)
  }, [])

  useEffect(() => {
    setLoading(false);

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      dispatch(send_prompt(prompt))
      setPrompt('')
    }
  }

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


  const MessageBox = styled(Grid, { shouldForwardProp: (prop) => prop !== 'theme'})(({ theme, isRight }) => ({
    border: `1px solid ${theme.palette.primary.main}`,
    boxShadow: `2px 2px 3px 1px ${theme.palette.primary.main}`,
    borderRadius: '5px',
    padding: '10px',
    display: 'flex',
    justifyContent: isRight ? 'end': 'start'
  }));

  return (
    <Grid ref={chatbox} container sx={{height: '100%', flexDirection: 'column', flexWrap: 'nowrap'}}>
      <Button variant="outlined" onClick={() => dispatch(init_prompt('You are a helpful assistant.'))}>init</Button>
      <PerfectScrollbar>
        <Grid 
          ref={dialogBox}
          item 
          container
          sx={{display: 'flex', flexWrap: 'wrap', height: chatboxHeight - 10 + 'px', alignContent: 'flex-start'}}
        >
          {messages.map(item => {
            return (
              item.message.role === 'assistant' 
              ? <AssistantBox theme={theme} item xs={12} key={item.message.index}>
                  <Avatar sx={{width: 30, height: 30}} src={Logo}/>
                  <Box sx={{ml: 2, mt: 0.5, width: '70%', lineHeight: '20px'}}>
                    {item.message.content}
                  </Box>
                </AssistantBox>
              : <UserBox theme={theme} item xs={12} key={item.message.index}>
                  <MessageBox isRight>
                    {item.message.content}
                  </MessageBox>
                </UserBox>
            )
          })}
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
