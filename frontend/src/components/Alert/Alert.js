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

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const Alert = ({ message, variant, className, iconClassName, queueMessage}) => {
  const classes = useStyles();
  const Icon = variantIcon[variant];

  const showQueueMessage = () => {
    return (
      <div>
        The change request has been submitted to the queue and will be fielded by an administrator shortly.
        For questions, please contact <a href="mailto:needhou@houstonimmigration.org">needhou@houstonimmigration.org</a>.
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
              queueMessage ? showQueueMessage() : message
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
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
};

export default Alert;
