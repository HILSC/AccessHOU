import React from 'react';
import {
  BrowserView,
  MobileView
} from "react-device-detect";

import logo from '../../images/logo-color.png';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './LogoStyles';
const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <BrowserView>
        <div className={classes.headerContainer}>
          <div><img className={classes.imageLogo} alt='logo' src={logo} /></div>
          <div className={classes.logoTextContainer}>
            <span className={classes.logoText}>An insiders guide to social services for immigrants in Greater Houston</span>
            <div style={{margin:'5px 25px'}}>
              <span id="google_translate_element" />
            </div>
          </div>
        </div>
      </BrowserView>
      <MobileView>
        <div className={classes.headerContainer}>
          <div><img className={classes.imageLogo} alt='logo' src={logo} /></div>
        </div>
      </MobileView>
    </React.Fragment>
  )
}
