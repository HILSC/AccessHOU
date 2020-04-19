import React from 'react';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

// Custom Components
import ArrowTooltip from 'components/ArrowTooltip/ArrowTooltip';

// Styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "./LabelStyles";
const useStyles = makeStyles(styles);

export default ({ text, variant, color, labelInfo=null }) => {
  const classes = useStyles();

  return (
    <Typography
      color={color ? color: 'inherit'}
      variant={variant ? variant : 'h6'}
      align="left"
      gutterBottom
      classes={{
        root: classes.customLabel
      }}
    >
      {text}
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
  )
}
