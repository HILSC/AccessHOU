import React from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

// API
import { 
  createAdvocacyReport
} from 'api'

// Material UI components
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

// Custom Components
import AdvocacyReportForm from 'components/AdvocacyReport/AdvocacyReportForm';

// ACTIONS
import { LOGOUT } from 'actions/user';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './AdvocacyReportCreateStyles';
const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const token = useSelector(state => state.user.accessToken);
  const userName = useSelector(state => state.user.name);
  
  const handleSave = (data) => {
    createAdvocacyReport(token, data).then((result) => {
      console.log(result);
    }).catch(() => {
      // // Logout user
      // dispatch({
      //   type: LOGOUT,
      //   data: null,
      // });
    });
  }

  return (
    <Container maxWidth="lg">
      <Paper className={classes.paper}>
        <AdvocacyReportForm
          handleSave={handleSave}
          userName={userName}
        />
      </Paper>
    </Container>
  );
}
