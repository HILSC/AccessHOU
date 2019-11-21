import React, {
  useEffect,
  useState,
} from 'react';

import {
  useSelector,
} from 'react-redux';

// API
import {
  getAgencyQueue,
  approveRejectAgencyQueue,
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
import AgencyData from 'components/Agency/AgencyData';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './AgencyQueueStyles';
const useStyles = makeStyles(styles);

const AgencyQueue = ({ match }) => {
  const classes = useStyles();

  const token = useSelector(state => state.user.accessToken);

  const { queueId } = match.params;

  const [pageData, setPageData] = useState({
    loading: true
  });
  const [confirmation, setConfirmation] = useState({ isOpen: false});

  useEffect(() => {
    getAgencyQueue(token, queueId).then(resulSet => {
      setPageData(data => ({
        ...data,
        agency: resulSet.data.agency,
        agencyQueue: resulSet.data.agency_queue,
        loading: false
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
    approveRejectAgencyQueue(token, {
      queue_id: pageData.agencyQueue.id,
      action: confirmation.action
    }).then(result => {

    });
  }

  return(
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12}>
         <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/private/queue" className={classes.link}>
            <QueueIcon className={classes.icon} />
            Queue
          </Link>
          <Typography color="textPrimary" className={classes.link}>
            Agency in queue
          </Typography>
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
              <AgencyData agency={pageData.agency} showMissingData={false} queueAgencyData={pageData.agencyQueue} />
              <div className={classes.buttons}>
                <Button
                variant="contained"
                color="primary"
                type="button"
                className={classes.button}
                onClick={handleRejectClick}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                className={classes.button}
                onClick={handleApproveClick}
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

export default AgencyQueue;
