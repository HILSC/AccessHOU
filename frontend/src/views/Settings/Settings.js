import React, {
  useRef,
  useState,
  useEffect,
} from 'react';

import {
  useSelector,
} from 'react-redux';

import {
  getAppSettings,
  updateEmergencyMode
} from 'api';

// Material UI Components
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';

// Components
import CustomInput from "components/CustomInput/CustomInput.js";

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './SettingsStyles';
const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();

  const token = useSelector(state => state.user.accessToken);

  const [values, setValues] = React.useState({ emergencyMode: false, emergency: null});
  const [showDialog, setShowDialog] = React.useState(false);

  const emergencyRef = useRef(null);
  const [emergencyError, setEmergencyError] = useState({error: false, message: ''});

  useEffect(() => {
    getAppSettings(token).then(result => {
      setValues(data => ({
        ...data,
        emergencyMode: result.data.emergency_mode,
      }));
    });
  }, [
    token
  ]);

  const handleChange = (event) => {
    event.persist();
    setValues(values => ({ ...values, [event.target.name]: event.target.value }));
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  }

  const emergencyFormValid = () => {
    if (!values['emergency'] ||
      values['emergency'].trim() === '' || values['emergency'] !== 'Emergency') {
        emergencyRef.current.focus();
        setEmergencyError(() => ({error: true, message: 'Please enter the word "Emergency".'}));
        return false;
    }else{
      setEmergencyError(() => ({error: false, message: ''}));
    }

    return true;
  }

  const handleEmergencyMode = () => {
    if (emergencyFormValid()) {
      updateEmergencyMode(token).then(result => {
        setValues(data => ({
          ...data,
          emergencyMode: result.data.emergency_mode,
        }));
        setShowDialog(false);
      });
    }
  }

  const handleSwitchChange = () => {
    setShowDialog(true);
    setValues(data => ({
      ...data,
      emergency: '',
    }));
  }

  return (
    <React.Fragment>
      <div className={classes.emergencyModeContainer}>
        <Grid container spacing={3} alignItems="center" >
          <Grid item xs={6} sm={6} md={6}>
            Emergency Mode
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            <Switch
              checked={values.emergencyMode}
              onChange={handleSwitchChange}
              value="emergencyMode"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </Grid>
        </Grid>
      </div>
      <Dialog
        open={showDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Are you sure you want to activate the emergency mode?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please type "Emergency" to activate the emergency mode.
          </DialogContentText>
          <CustomInput
            id="emergency"
            errorDetails={{
              error: emergencyError && emergencyError.error ? true : false,
              message: emergencyError ? emergencyError.message : '',
            }}
            formControlProps={{
              fullWidth: true
            }}
            autoFocus={true}
            inputProps={{
              inputRef: emergencyRef,
              label: "Validation Text *",
              onChange: handleChange,
              name: "emergency",
              value: values.emergency ? values.emergency : '',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleDialogClose} color="primary">
            No
          </Button>
          <Button variant="contained" onClick={handleEmergencyMode} color="secondary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>          
    </React.Fragment>
  );
}
