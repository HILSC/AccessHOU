import React, { Component, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import clsx from 'clsx';

import {
  useSelector,
} from 'react-redux';

// API
import {
  verifyAgencies
} from 'api';

// Material UI components
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import CircularProgress from '@material-ui/core/CircularProgress';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './AgenciesVerifyStyles';
const useStyles = makeStyles(styles);

export class AgenciesVerify extends Component {

    state = {
        agencies: [],
    };

    componentDidMount() {
        verifyAgencies().then( names => {
            const agencies = [];
            names.data.forEach((name) => {
                agencies.push(name)
            });
            this.setState(state => ({ ...state, agencies }))
          }).catch((err) => {
            console.log(err)
        })
    }

    render() {

        return (
            <Container maxWidth="lg">
              <Paper>
                  <h1>Updating Agencies</h1>
                    <div style={{padding:'30px',textAlign:'center'}}>
                      { this.state.agencies.map( agency =>
                          <p>{ agency }</p>
                      ) }
                  </div>
              </Paper>
            </Container>
        )
    }

}

export default AgenciesVerify;
