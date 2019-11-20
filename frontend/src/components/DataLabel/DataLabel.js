import React from 'react';

import Typography from '@material-ui/core/Typography';
import BadgeList from 'components/BadgeList/BadgeList';

import {
  ACTION_CLASS
} from 'constants.js';

// Styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "./DataLabelStyles";
const useStyles = makeStyles(styles);

export default ({ labelText, dataText, dataTextWithFormat, dataTextClass, isAList=false }) => {
  const classes = useStyles();

  const textClass = dataTextClass && dataTextClass === ACTION_CLASS.CHANGED ? classes.infoChanged :
    dataTextClass && dataTextClass === ACTION_CLASS.DELETED ? classes.infoDeleted : null;

  return (
    <div>
      <Typography variant="body1" align="left" color="textSecondary">
        {labelText}
      </Typography>
      {
        isAList ? (
          <BadgeList items={dataText} dataTextClass={dataTextClass} />
        ) : labelText === "Website" ? dataTextWithFormat !== '' ? (
              <a href={dataTextWithFormat} target="_blank" rel="noopener noreferrer" className={textClass}>{dataText}</a>
          ): {dataText} :
          (
            <Typography variant="body1" align="left" color="textPrimary" classes={{
              root: textClass
            }}>
              {labelText === 'Phone' ? (
                <a href={`tel:${dataText}`}>{dataText}</a>
              ) : dataText}
            </Typography>
          )
        
      }
    </div>
    
  )
}
