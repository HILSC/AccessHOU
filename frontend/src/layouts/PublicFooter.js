import React from 'react';

import {
  isMobile,
} from 'react-device-detect';

// Materia UI Components
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

// Components
import Heart from 'images/heart.svg';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './PublicFooterStyles';
const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <div className={isMobile ? classes.mobileFooter : null}>
          <div className={classes.footerMobileP}>
            <Typography variant="body1">
              Want to request adding a new agency or program? <a className={classes.editorLink} rel="noopener noreferrer" href="/editor" target="_blank">Request here</a>
            </Typography>
          </div>
          <div className={classes.footerMobileP}>
            <Typography variant="body1">
              Questions? Comments? Email <a className={classes.editorLink} rel="noopener noreferrer" href="mailto:accesshou@houstonimmigration.org">accesshou@houstonimmigration.org</a>
            </Typography>
          </div>
          <div className={classes.footerMobileP}>
            <Typography variant="body2">
            For staff training on how to update or use AccessHOU, please email <a href="mailto:accesshou@houstonimmigration.org">accesshou@houstonimmigration.org</a>.
            </Typography>
          </div>
          <div className={classes.footerMobileP}>
            <Typography variant="body2">
              The AccessHOU Houston Social Services Database is a product of <a rel="noopener noreferrer" href="https://www.houstonimmigration.org/" target="_blank"><abbr title="Houston Immigration Legal Services Collaborative">HILSC</abbr></a>.
            </Typography>
          </div>

          <div className={classes.footerMobileP}>
            <Typography variant="body2">
              Made with <img alt="love" src={Heart}/> by <a className={classes.footerLink} rel="noopener noreferrer" href="https://www.brightanchor.com" target="_blank">BrightAnchor</a>. Updates by <a className={classes.footerLink} rel="noopener noreferrer" href="https://di-verge.com/" target="_blank">DI-Vege</a>.
            </Typography>
          </div>
        </div>
      </Container>
    </footer>
  )
}
