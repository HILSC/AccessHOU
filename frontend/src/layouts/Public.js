import React, {
  useState,
  useEffect,
} from 'react';

import {
  isMobile,
} from 'react-device-detect';

// API
import { getAppEmegencyMode } from 'api';

// Materia UI Components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

// Components
import Alert from 'components/Alert/Alert';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './PublicStyles';
const useStyles = makeStyles(styles);

export default ({ children }) =>{

  const classes = useStyles();

  const [emergencyMode, setEmergencyMode] = useState(null);

  useEffect(() => {
    const loadScript = (src) => {
      var tag = document.createElement('script');
      tag.async = false;
      tag.src = src;
      var body = document.getElementsByTagName('body')[0];
      body.appendChild(tag);
    }

    loadScript('//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        layout: isMobile ? 0 : 1,
      }, 'google_translate_element')
    };

    getAppEmegencyMode().then(result => {
      setEmergencyMode(data => ({
        ...data,
        "isActive": result.data.emergency_mode,
        "message": result.data.emergency_message,
      }));
    });
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          <PublicHeader />
        </Toolbar>
      </AppBar>
      <main className={classes.main}>
        {
          emergencyMode && emergencyMode.isActive ? (
            <Alert
              className={classes.emergencyMode}
              iconClassName={classes.emergencyModeIcon}
              variant={"warning"}
              message={emergencyMode.message} />
          ) : null
        }
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
