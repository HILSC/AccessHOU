import React, {
  useEffect,
  useState,
} from "react";

import { NavLink } from "react-router-dom";

import {
  useSelector,
} from 'react-redux';

// API
import {
  getQueue
} from 'api';

// Material UI components
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './DashboardStyles';
const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();

  const loggedUser = useSelector(state => state.user);

  const [values, setValues] = useState(null);

  const token = useSelector(state => state.user.accessToken);

  useEffect(() => {
    getQueue(token).then(resultSet => {
      setValues(data => ({
        ...data,
        queue: resultSet.data.results,
        totalRecords: resultSet.data.total_records,
      }));
    });
  }, [
    token,
  ]);

  return (
    <Grid container spacing={3} >
      <Grid item xs={12} sm={12} md={12}>
        Howdy! {loggedUser.email}
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Queue pending review
            </Typography>
            <Typography variant="body2" component="p" classes={{
              root: classes.contentPrimary
            }}>
              {values ? values.totalRecords : 0}
            </Typography>
          </CardContent>
          <CardActions>
            <NavLink to={`/private/queue`}>
              See queue
            </NavLink>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}
