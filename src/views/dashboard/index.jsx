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

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import { Box, InputAdornment, OutlinedInput, useTheme } from '@mui/material';
import { BsFillSendFill } from "react-icons/bs";
import PerfectScrollbar from 'react-perfect-scrollbar';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const theme = useTheme();
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

  return (
    <Grid ref={chatbox} container sx={{height: '100%', flexDirection: 'column', flexWrap: 'nowrap'}}>
      <PerfectScrollbar>
        <Grid 
          ref={dialogBox}
          item 
          sx={{display: 'flex', flexWrap: 'wrap', height: chatboxHeight - 10 + 'px'}}
        >
          <div style={{width: '100%',height: '100px'}}>123</div>
          <div style={{width: '100%',height: '100px'}}>123</div>
          <div style={{width: '100%',height: '100px'}}>123</div>
          <div style={{width: '100%',height: '100px'}}>123</div>
          <div style={{width: '100%',height: '100px'}}>123</div>
          <div style={{width: '100%',height: '100px'}}>123</div>
          <div style={{width: '100%',height: '100px'}}>123</div>
          <div style={{width: '100%',height: '100px'}}>123</div>
        </Grid>
      </PerfectScrollbar>
      <Grid item sx={{width: '70%', marginLeft: 'auto', marginRight: 'auto'}}>
        <OutlinedInput
          sx={{ width: '100%' }}
          id="input-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Set prompt here..."
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
      {/* <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeLightCard
                  {...{
                    isLoading: isLoading,
                    total: 203,
                    label: 'Total Income',
                    icon: <StorefrontTwoToneIcon fontSize="inherit" />
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid> */}
      {/* <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid> */}
    </Grid>
  );
};

export default Dashboard;
