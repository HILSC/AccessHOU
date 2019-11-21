import React from "react";

// Custom components
import Label from 'components/Label/Label';

// Constants
import { 
  WEEKDAYS,
  ACTION_CLASS
} from "constants.js";

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './ScheduleDataStyles';
const useStyles = makeStyles(styles);

export default ({ values, dataTextClass }) => {
  const classes = useStyles();

  const textClass = dataTextClass && dataTextClass === ACTION_CLASS.CHANGED ? classes.infoChanged :
    dataTextClass && dataTextClass === ACTION_CLASS.DELETED ? classes.infoDeleted : null;

  /*
  Sunday 9AM - 4PM
  Monday 9AM - 4PM
  */
  return (
    <React.Fragment>
      {
        values ? WEEKDAYS.map((day, idx) => {
          let from = values[`${day}-from`];
          let to = values[`${day}-to`];

          if (from && to) {
            return (
              <div key={idx} className={textClass}>
                <Label 
                  text={`${day} - ${from ? from : ''} - ${to ? to : ''}`}
                  variant="body2"
                  color={textClass ? null : "textSecondary"} />
              </div>
            )
          }
          
          return null;
          
        }): null
      }
    </React.Fragment>
  );
}
