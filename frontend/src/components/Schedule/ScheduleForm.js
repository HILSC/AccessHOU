import React from "react";
import moment from 'moment';

import {
  isBrowser,
} from "react-device-detect";

// Material UI Components
import Grid from "@material-ui/core/Grid";

import CustomTimePicker from '../CustomTimePicker/CustomTimePicker';

import { 
  WEEKDAYS,
} from "constants.js";

// Styles
import 'rc-time-picker/assets/index.css';

import { makeStyles } from "@material-ui/core/styles";
import styles from "./ScheduleFormStyles";
const useStyles = makeStyles(styles);


export default ({ handleScheduleChanges, values, autoPopulate=true }) => {
  const classes = useStyles();

  const handleChange = ({name, value}) => {
    handleScheduleChanges({[name]: value});
  }

  const from = autoPopulate ? moment().hour(9).minute(0) : null;
  const to = autoPopulate ? moment().hour(5).minute(0) : null;

  return (
    <div>
    {
      WEEKDAYS.map((day, key) => {
        return(
          <Grid key={key} container spacing={isBrowser ? 5 : 2}>
            <Grid item xs={12} sm={4} md={4} classes={{
              root: classes.customGrid
            }}>
              <div className={ isBrowser ? classes.cell : '' }>{day}</div>
            </Grid>
            <Grid item xs={12} sm={4} md={4} classes={{
              root: classes.customGrid
            }}>
              <div className={ isBrowser ? classes.cell : '' }>
                <CustomTimePicker
                  day={day}
                  name={`${day}-from`}
                  values={values}
                  defaultValue={from}
                  handleTimePicked={handleChange}  
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={4} md={4} classes={{
              root: classes.customGrid
            }}>
              <div className={ isBrowser ? classes.cell : '' }>
                <CustomTimePicker
                  day={day}
                  name={`${day}-to`}
                  values={values}
                  defaultValue={to}
                  handleTimePicked={handleChange}  
                />
              </div>
            </Grid>
          </Grid>
        )
      })
    }
    </div>
  );
}
