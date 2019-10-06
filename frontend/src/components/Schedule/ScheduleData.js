import React from "react";

// Custom components
import Label from 'components/Label/Label';

import { 
  WEEKDAYS,
} from "constants.js";

export default ({ values }) => {
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
              <div key={idx}>
                <Label 
                  text={`${day} - ${from ? from : ''} - ${to ? to : ''}`}
                  variant="body2"
                  color="textSecondary" />
              </div>
            )
          }
          
          return null;
          
        }): null
      }
    </React.Fragment>
  );
}
