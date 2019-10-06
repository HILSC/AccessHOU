import React from "react";

import {
  useSelector,
} from 'react-redux';

// Material UI components
import Grid from '@material-ui/core/Grid';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './DashboardStyles';
const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();

  const loggedUser = useSelector(state => state.user);

  return (
    <Grid container spacing={3} >
      <Grid item xs={12} sm={12} md={12}>
        Howdy! {loggedUser.email}
      </Grid>
    </Grid>
  );
}
