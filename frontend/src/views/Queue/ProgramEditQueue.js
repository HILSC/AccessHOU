import React, {
  useEffect,
  useState,
} from 'react';
import { Redirect } from 'react-router-dom';

import {
  useSelector,
} from 'react-redux';

// API
import {
  getProgramQueue,
  updateProgramQueue,
} from 'api';

// Material UI components
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom components
import ProgramForm from 'components/Program/ProgramForm';
import Alert, { ALERT_VARIANTS } from 'components/Alert/Alert';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './ProgramEditQueueStyles';
const useStyles = makeStyles(styles);

const ProgramEditQueue = ({ match }) => {
  const classes = useStyles();

  const token = useSelector(state => state.user.accessToken);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);

  const { queueId } = match.params;

  const [pageData, setPageData] = useState({
    loading: true,
    viewProgramQueue: false,
  });

  useEffect(() => {
    getProgramQueue(token, queueId).then(resulSet => {
      setPageData(data => ({
        ...data,
        programQueue: resulSet.data.program_queue,
        emergencyModeOn: resulSet.data.emergency_mode_on,
        loading: false,
        messageType: ALERT_VARIANTS.SUCCESS
      }));
    }).catch(() => {
      setPageData(data => ({
        ...data,
        messageType: ALERT_VARIANTS.ERROR,
        message: `There is a problem getting the program's details.`
      }))
    });
  }, [
    token,
    queueId
  ]);

  const handleSave = (data) => {
    updateProgramQueue(token, data).then((result) => {
      setPageData(data => ({
        ...data,
        messageType: ALERT_VARIANTS.SUCCESS,
        viewProgramQueue: true,
      }));
    }).catch((error) => {
      setPageData(data => ({
        ...data,
        messageType: ALERT_VARIANTS.ERROR,
        message: 'There was a problem while saving the changes, please try again.'
      }));
    });
  }

  if (pageData.viewProgramQueue) {
    let url = `/private/queue/program/${queueId}`;
    return <Redirect push to={url} />
  }

  window.scrollTo(0, 0);

  return(
    <Paper className={classes.paper}>
      {
        pageData.messageType === ALERT_VARIANTS.ERROR ? (
          <Alert
            variant={pageData.messageType}
            message={pageData.message}
          />
        ) : null
      }
      {
        pageData.programQueue ? (
          <ProgramForm
            isAuthenticated={isAuthenticated}
            title={'Update Program in Queue'} 
            handleSave={handleSave}
            showDeleteButton={false}
            data={pageData.programQueue}
          />
        ) : (
          <div className={classes.messages}>
            <CircularProgress className={classes.progress} color="primary" />
          </div>
        )
      }
    </Paper>
  )
}

export default ProgramEditQueue;
