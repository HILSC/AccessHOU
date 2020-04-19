import React from 'react';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import BadgeList from 'components/BadgeList/BadgeList';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

// Custom Components
import ArrowTooltip from 'components/ArrowTooltip/ArrowTooltip';

import {
  ACTION_CLASS
} from 'constants.js';

// Styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "./DataLabelStyles";
const useStyles = makeStyles(styles);

export default ({ labelText, dataText, dataTextWithFormat, dataTextClass, isAList=false, listOptions=[], labelInfo={show: false} }) => {
  const classes = useStyles();

  const textClass = dataTextClass && dataTextClass === ACTION_CLASS.CHANGED ? classes.infoChanged :
    dataTextClass && dataTextClass === ACTION_CLASS.DELETED ? classes.infoDeleted : null;

  return (
    <div>
      <Typography variant="body1" align="left" color="textSecondary" classes={{
        root: classes.customLabel
      }}>
        {labelText}
        {
          labelInfo && labelInfo.show ? (
            <span className={classes.customlabelSVG}>
              <ArrowTooltip title={labelInfo.msg}>
                <InfoOutlinedIcon color="primary" fontSize="default" />
              </ArrowTooltip>
            </span>
          ) : null
        }
      </Typography>
      {
        isAList ? (
          <BadgeList items={dataText} options={listOptions} dataTextClass={dataTextClass} />
        ) : labelText === "Website" ? dataTextWithFormat !== '' ? (
              <a href={dataTextWithFormat} target="_blank" rel="noopener noreferrer" className={textClass}>{dataText}</a>
          ): {dataText} :
          (
            <Typography variant="body1" align="left" color="textPrimary" classes={{
              root: textClass
            }}>
              {labelText.toLowerCase().includes('phone') ? (
                <a href={`tel:${dataText}`}>{dataText}</a>
              ) : labelText.toLowerCase().includes('email') ? (
                <a href={`mailto:${dataText}`}>{dataText}</a>
              ) : dataText}
            </Typography>
          )
        
      }
    </div>
    
  )
}
