import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import clsx from 'clsx';

import MapContainer from 'components/Map/Map';

import {
  useSelector,
} from 'react-redux';

// API
import {
  mapPoints
} from 'api';

// Material UI components
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom components
// import AgencyData from 'components/Agency/AgencyData';
// import Alert from 'components/Alert/Alert';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './PartnersMapStyles';
const useStyles = makeStyles(styles);

export default ({ match }) => {

  const classes = useStyles();
  const { params: { slug } } = match;
  const user = useSelector(state => state.user);

  const point = mapPoints({});

    return (
      <Container maxWidth="lg">
        <Paper className={classes.paper}>
            <h1>Network Partner Map</h1>
            <div className={classes.mapContainer}>
                <MapContainer />
            </div>
        </Paper>
      </Container>
    )

}
