import React, {
  useEffect
} from 'react';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import QueueIcon from '@material-ui/icons/Queue';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './ProgramQueueStyles';
const useStyles = makeStyles(styles);

const ProgramQueue = ({ match }) => {
  const classes = useStyles();

  const queueId = match.params;

  useEffect(() => {

  }, [
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
        hola marcela
      </Grid>
    </Grid>
  )

}

export default ProgramQueue;
