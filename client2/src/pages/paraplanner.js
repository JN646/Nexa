import React from 'react';
import CaseList from '../components/CaseList';
import ParaplannerCaseList from '../components/ParaplannerCaseList';
import ParaplannerDoneCaseList from '../components/ParaplannerDoneCaseList';
import ParaplannerLostCaseList from '../components/ParaplannerLostCaseList';
import { Container, Paper, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

function Paraplanner() {
  return (
    <Container maxWidth='xl'>
      <Paper sx={{ p: 2, mb: 2 }}>
        {/* Welcome Back */}
        <Typography variant='body1' component='p' gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant='small' component='small'>
          {/* Notification Icon */}
          <NotificationsIcon />
          You have 0 new notifications
        </Typography>
      </Paper>

      {/* Available Cases */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant='h4' component='h2'>Available Cases</Typography>
        <Typography variant='body1' component='p'>Click on a case to view details and bid on it.</Typography>
        <CaseList />
      </Paper>

      {/* My Open Cases */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant='h4' component='h2'>My Open Cases</Typography>
        <ParaplannerCaseList />
      </Paper>

      {/* My Done Cases */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant='h4' component='h2'>My Done Cases</Typography>
        <ParaplannerDoneCaseList />
      </Paper>

      {/* My Lost Cases */}
      <Paper sx={{ p: 2 }}>
        <Typography variant='h4' component='h2'>My Lost Bids</Typography>
        <ParaplannerLostCaseList />
      </Paper>
    </Container>
  );
}

export default Paraplanner;