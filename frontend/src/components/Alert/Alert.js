import React from 'react';
import PropTypes from "prop-types";
import clsx from 'clsx';

// Material UI Components
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import SnackbarContent from '@material-ui/core/SnackbarContent';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './AlertStyles';
const useStyles = makeStyles(styles);

export const ALERT_VARIANTS = {
  ERROR: 'error',
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning'
}

const VARIANT_ICONS = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const Alert = ({ message, variant, className, iconClassName, queueMessage, generalMessage}) => {
  const classes = useStyles();
  const Icon = VARIANT_ICONS[variant];

  const showQueueMessage = () => {
    return (
      <div>
        The change request has been submitted to the queue and will be fielded by an administrator shortly.
        For questions, please contact <a href="mailto:accesshou@houstonimmigration.org">accesshou@houstonimmigration.org</a>.
      </div>
    )
  }

  const showGeneralMessage = () => {
    return (
      <div>
        An error has occurred. Please try again and if the error persists email <a href="mailto:accesshou@houstonimmigration.org">accesshou@houstonimmigration.org</a>. Thank you.
      </div>
    )
  }

  return (
    <SnackbarContent
      className={clsx(classes[variant], className, classes.alertBox)}
      aria-describedby="client-snackbar"
      message={
        <div id="client-snackbar" className={classes.message}>
          <div>
            <Icon className={clsx(iconClassName, classes.icon, classes.iconVariant)} />
          </div>
          <div>
            {
              queueMessage ? showQueueMessage() : generalMessage ? showGeneralMessage() : message
            }
          </div>
        </div>
      }
    />
  )
}

Alert.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  variant: PropTypes.oneOf([ALERT_VARIANTS.ERROR, ALERT_VARIANTS.INFO, ALERT_VARIANTS.SUCCESS, ALERT_VARIANTS.WARNING]).isRequired,
};

export default Alert;
