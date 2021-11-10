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
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// Custom components
import AgencyData from 'components/Agency/AgencyData';
import Alert, { ALERT_VARIANTS } from 'components/Alert/Alert';
import { CustomBlueButton } from 'theme/customTheme';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './AgencyQueueStyles';
const useStyles = makeStyles(styles);

const AgencyQueue = ({ match }) => {
  const classes = useStyles();

  const token = useSelector(state => state.user.accessToken);
  const loggedUser = useSelector(state => state.user);

  const { queueId } = match.params;

  const [pageData, setPageData] = useState({
    loading: true,
    hilscVerified: loggedUser.hilscVerified
  });

  const [confirmation, setConfirmation] = useState({ isOpen: false });
  const [editQueue, setEditQueue] = useState(false);
  const [goBackToQueue, setGoBackToQueue] = useState(false);

  useEffect(() => {
    getAgencyQueue(token, queueId).then(resulSet => {
      setPageData(data => ({
        ...data,
        agency: resulSet.data.agency,
        agencyQueue: resulSet.data.agency_queue,
        emergencyModeOn: resulSet.data.emergency_mode_on,
        loading: false
      }));
    }).catch(() => {
      setConfirmation(data => ({
        ...data,
        message: 'There was a problem while trying to get this queue. Most likely, these queue does not exist.',
        messageType: ALERT_VARIANTS.ERROR
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
      action: "approve",
    }));
  }

  const handleRejectClick = () => {
    setConfirmation(data => ({
      ...data,
      isOpen: true,
      action: "reject"
    }));
  }

  const handleEditClick = () => {
    setEditQueue(true);
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
      action: confirmation.action,
      hilsc_verified: pageData.hilscVerified
    }).then(result => {
      localStorage.setItem('queueMessage', result.data.message);
      setGoBackToQueue(true);
      setConfirmation(data => ({
        ...data,
        isOpen: false,
        action: null,
      }));
    }).catch(() => {
      setConfirmation(data => ({
        ...data,
        message: 'There was a problem while trying to approve/reject this queue.',
        messageType: ALERT_VARIANTS.ERROR
      }));
    });
  }

  const handleHilscVerifiedChange = ({ target }) => {
    setPageData({ ...pageData, "hilscVerified": target.checked });
  }

  if(editQueue) {
    let url = `/private/queue/agency/edit/${queueId}`;
    return <Redirect push to={url} />
  }

  if(goBackToQueue){
    let url = `/private/queue/?menu=3`;
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
          <Typography color="textPrimary">
            Agency
          </Typography>
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
        {
          confirmation && confirmation.message ? (
            <Alert
              variant={confirmation.messageType}
              message={confirmation.message}
            />
          ) : null
        }
        {
          pageData.loading ? (
            <div className={classes.messages}>
              <CircularProgress className={classes.progress} color="primary" />
            </div>
          ) : (
            <React.Fragment>
              <AgencyData agency={pageData.agency} showMissingData={false} queueAgencyData={pageData.agencyQueue} />
              <div className={classes.verifiedContainer}>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox checked={pageData.hilscVerified} onChange={handleHilscVerifiedChange} />
                    }
                    label="HILSC Network Partner"
                  />
                </FormGroup>
              </div>
              <div className={classes.buttons}>
                <Button
                variant="contained"
                color="primary"
                type="button"
                className={classes.button}
                onClick={handleRejectClick}
                disabled={pageData.agencyQueue.emergency_mode && pageData.emergencyModeOn}
              >
                Reject
              </Button>
              <CustomBlueButton
                variant="contained"
                color="info"
                type="button"
                className={classes.button}
                onClick={handleEditClick}
                disabled={pageData.agencyQueue.emergency_mode && pageData.emergencyModeOn}
              >
                Edit
              </CustomBlueButton>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                className={classes.button}
                onClick={handleApproveClick}
                disabled={pageData.agencyQueue.emergency_mode && pageData.emergencyModeOn}
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
