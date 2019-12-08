import React, {
  useEffect,
  useState,
} from 'react';

import {
  useSelector,
} from 'react-redux';

// API
import {
  getProgramQueue,
  approveRejectProgramQueue
} from 'api';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import QueueIcon from '@material-ui/icons/Queue';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

// Custom components
import ProgramData from 'components/Program/ProgramData';
import Alert from 'components/Alert/Alert';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './ProgramQueueStyles';
const useStyles = makeStyles(styles);

const ProgramQueue = ({ match }) => {
  const classes = useStyles();

  const token = useSelector(state => state.user.accessToken);

  const { queueId } = match.params;

  const [pageData, setPageData] = useState({
    loading: true
  });

  const [confirmation, setConfirmation] = useState({ isOpen: false})

  useEffect(() => {
    getProgramQueue(token, queueId).then(resulSet => {
      setPageData(data => ({
        ...data,
        program: resulSet.data.program,
        programQueue: resulSet.data.program_queue,
        emergencyModeOn: resulSet.data.emergency_mode_on,
        loading: false
      }));
    }).catch(() => {
      setConfirmation(data => ({
        ...data,
        message: 'There was a problem while trying to get this queue. Most likely, these queue does not exist.',
        messageType: 'error'
      }));
    });
  }, [
    token,
    queueId
  ]);

  const handleApproveClick = () => {
    setConfirmation(data => ({
      ...data,
      isOpen: true,
      action: "approve"
    }));
  }

  const handleRejectClick = () => {
    setConfirmation(data => ({
      ...data,
      isOpen: true,
      action: "reject"
    }));
  }

  const handleDialogClose = () => {
    setConfirmation(data => ({
      ...data,
      isOpen: false,
      action: null
    }));
  }

  const handleConfirmation = () => {
    approveRejectProgramQueue(token, {
      queue_id: pageData.programQueue.id,
      action: confirmation.action
    }).then(result => {
      setConfirmation(data => ({
        ...data,
        isOpen: false,
        action: null,
        messageType: 'success',
        message: result.data.message,
      }));
    }).catch(() => {
      setConfirmation(data => ({
        ...data,
        message: 'There was a problem while trying to approve/reject this queue.',
        messageType: 'error'
      }));
    });
  }

  if(confirmation && confirmation.message){
    return (
      <Alert
        variant={confirmation.messageType}
        message={confirmation.message}
      />
    );
  }

  return(
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12}>
         <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/private/queue" className={classes.link}>
            <QueueIcon className={classes.icon} />
            Queue
          </Link>
          <Typography color="textPrimary">
            Program
          </Typography>
          {
            pageData.programQueue && pageData.programQueue.emergency_mode && pageData.emergencyModeOn ? (
              <div className={classes.emergencyContainer}>EMERGENCY MODE ON</div>
            ) : null
          }
          {
            pageData.programQueue ? (
              <div className={classes.actionContainer}>{pageData.programQueue.action.toUpperCase()}</div>
          ) : null}
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        {
          pageData.loading ? (
            <div className={classes.messages}>
              <CircularProgress className={classes.progress} color="primary" />
            </div>
          ) : (
            <React.Fragment>
              <ProgramData program={pageData.program} showMissingData={false} queueProgramData={pageData.programQueue} />
              <div className={classes.buttons}>
                <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  className={classes.button}
                  onClick={handleRejectClick}
                  disabled={pageData.programQueue.emergency_mode && pageData.emergencyModeOn}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  className={classes.button}
                  onClick={handleApproveClick}
                  disabled={pageData.programQueue.emergency_mode && pageData.emergencyModeOn}
                >
                  Approve
                </Button>
              </div>
            </React.Fragment>
          )
        }
        <Dialog
          open={confirmation.isOpen}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Are you sure you want to ${confirmation.action} this request?`}
          </DialogTitle>
          <DialogActions>
            <Button variant="contained" onClick={handleDialogClose} color="primary">
              No
            </Button>
            <Button variant="contained" onClick={handleConfirmation} color="secondary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>    
      </Grid>
    </Grid>
  )

}

export default ProgramQueue;
