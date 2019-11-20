import React, {
  useEffect,
  useState,
} from 'react';

import {
  useSelector,
} from 'react-redux';

// API
import {
  getProgramQueue
} from 'api';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import QueueIcon from '@material-ui/icons/Queue';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom components
import ProgramData from 'components/Program/ProgramData';

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

  useEffect(() => {
    getProgramQueue(token, queueId).then(resulSet => {
      setPageData(data => ({
        ...data,
        program: resulSet.data.program,
        programQueue: resulSet.data.program_queue,
        loading: false
      }));
    });
  }, [
    token,
    queueId
  ]);

  return(
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12}>
         <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/private/queue" className={classes.link}>
            <QueueIcon className={classes.icon} />
            Queue
          </Link>
          <Typography color="textPrimary" className={classes.link}>
            Program in queue
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
              <ProgramData program={pageData.program} showMissingData={false} queueProgramData={pageData.programQueue} />
              <div className={classes.buttons}>
                <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  className={classes.button}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  className={classes.button}
                >
                  Approve
                </Button>
              </div>
            </React.Fragment>
          )
        }
      </Grid>
    </Grid>
  )

}

export default ProgramQueue;
