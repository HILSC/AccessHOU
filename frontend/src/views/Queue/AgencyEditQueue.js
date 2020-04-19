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
  getAgencyQueue,
  updateAgencyQueue,
} from 'api';

// Material UI components
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import QueueIcon from '@material-ui/icons/Queue';

// Custom components
import AgencyForm from 'components/Agency/AgencyForm';
import Alert, { ALERT_VARIANTS } from 'components/Alert/Alert';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './AgencyEditQueueStyles';
const useStyles = makeStyles(styles);

const AgencyEditQueue = ({ match }) => {
  const classes = useStyles();

  const token = useSelector(state => state.user.accessToken);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);

  const { queueId } = match.params;

  const [pageData, setPageData] = useState({
    loading: true,
    viewAgencyQueue: false,
  });

  useEffect(() => {
    getAgencyQueue(token, queueId).then(resulSet => {
      setPageData(data => ({
        ...data,
        agencyQueue: resulSet.data.agency_queue,
        emergencyModeOn: resulSet.data.emergency_mode_on,
        loading: false,
        messageType: ALERT_VARIANTS.SUCCESS,
      }));
    }).catch(() => {
      setPageData(data => ({
        ...data,
        messageType: ALERT_VARIANTS.ERROR,
        message: `There is a problem getting the agency's details.`
      }));
    });
  }, [
    token,
    queueId
  ]);

  const handleSave = (data) => {
    updateAgencyQueue(token, data).then(() => {
      setPageData(data => ({
        ...data,
        messageType: ALERT_VARIANTS.SUCCESS,
        viewAgencyQueue: true,
      }));
    }).catch(() => {
      setPageData(data => ({
        ...data,
        viewAgencyQueue: false,
        messageType: ALERT_VARIANTS.ERROR,
        message: 'There was a problem while saving the changes, please try again.'
      }));
    });
  }

  if (pageData.viewAgencyQueue) {
    let url = `/private/queue/agency/${queueId}`;
    return <Redirect push to={url} />
  }

  return(
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12}>
         <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/private/queue" className={classes.link}>
            <QueueIcon className={classes.icon} />
            Queue
          </Link>
          <Link color="inherit" href={`/private/queue/agency/${queueId}`} className={classes.link}>
            Agency
          </Link>
          {
            pageData.agencyQueue && pageData.agencyQueue.emergency_mode && pageData.emergencyModeOn ? (
              <div className={classes.emergencyContainer}>EMERGENCY MODE ON</div>
            ) : null}
          {
            pageData.agencyQueue ? (
              <div className={classes.actionContainer}>{pageData.agencyQueue.action.toUpperCase()}</div>
          ) : null}
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
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
            pageData.agencyQueue ? (
              <AgencyForm
                isAuthenticated={isAuthenticated} 
                title={'Update Agency in Queue'} 
                handleSave={handleSave}
                showDeleteButton={false}
                agency={pageData.agencyQueue}
              />
            ) : (
              <div className={classes.messages}>
                <CircularProgress className={classes.progress} color="primary" />
              </div>
            )
          }
        </Paper>
      </Grid>
    </Grid>
  )
}

export default AgencyEditQueue;
