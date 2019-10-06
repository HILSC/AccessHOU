import React from "react";
import TimePicker from 'rc-time-picker';
import moment from 'moment';

import {
  isBrowser,
} from "react-device-detect";

// Material UI Components
import Grid from "@material-ui/core/Grid";

import { 
  WEEKDAYS,
} from "constants.js";

// Styles
import 'rc-time-picker/assets/index.css';

import { makeStyles } from "@material-ui/core/styles";
import styles from "./ScheduleFormStyles";
const useStyles = makeStyles(styles);

const CustomTimePicker = ({ name, values, defaultValue, day, handleTimePicked }) => {
  const handleChange = (value) => {
    if (value) {
      handleTimePicked({name: name, value: value.format('h:mm A')});
    } else{
      handleTimePicked({name: name, value: ''});
    }
  }

  const format = 'h:mm A';

  let value = defaultValue;
  if (values[name]) {
    value = moment(values[name], format);
  }

  const weekends = ["Sunday", "Saturday"];

  if (value === defaultValue && weekends.includes(day)){
    value = null;
  }

  return (
    <TimePicker
      showSecond={false}
      defaultValue={value}
      onChange={handleChange}
      format={format}
      minuteStep={15}
      use12Hours
      inputReadOnly
    />
  )
}

export default ({ handleScheduleChanges, values }) => {
  const classes = useStyles();

  const handleChange = ({name, value}) => {
    handleScheduleChanges({[name]: value});
  }

  const from = moment().hour(9).minute(0);
  const to = moment().hour(5).minute(0);

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
