import React from 'react';
import {
  BrowserView,
  MobileView
} from "react-device-detect";

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './LogoStyles';
const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();
  return (
    <div>
      <BrowserView>
        <div className={classes.logo}>
          <span>A database of resources for agencies working with immigrants in Greater Houston</span>
        </div>
      </BrowserView>
      <MobileView>
        <div className={classes.logo} />
      </MobileView>
    </div>
  )
}
