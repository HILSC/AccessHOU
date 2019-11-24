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
import Alert from 'components/Alert/Alert';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './SettingsStyles';
const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();

  const token = useSelector(state => state.user.accessToken);

  const [values, setValues] = React.useState({ emergency_mode: false, emergency: null});
  const [showDialog, setShowDialog] = React.useState(false);

  const emergencyRef = useRef(null);
  const emergencyMessageRef = useRef(null);

  const [emergencyError, setEmergencyError] = useState({error: false, message: ''});
  const [emergencyMessageError, setEmergencyMessageError] = useState({error: false, message: ''});

  useEffect(() => {
    getAppSettings(token).then(result => {
      setValues(data => ({
        ...data,
        emergency_mode: result.data.emergency_mode,
        emergency_message: result.data.emergency_message,
        mode_state: result.data.emergency_mode,
      }));
    }).catch(() => {
      setValues(data => ({
        ...data,
        message: "There is a problem getting settings information.",
        messageType: "error",
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
      updateEmergencyMode(token, values).then(result => {
        setValues(data => ({
          ...data,
          emergency_mode: result.data.emergency_mode,
          emergency_message: result.data.emergency_message,
          message: `Emergency mode ${result.data.emergency_mode ? 'activated' : 'deactivated' } successfully.`,
          messageType: "success"
        }));
      }).catch(() => {
        setValues(data => ({
          ...data,
          message: "There was a problem while trying to update the settings.",
          messageType: "error",
        }));
      });

      setShowDialog(false);
    }
  }

  const validateErrorMessage = () => {
    if (!values['emergency_message'] ||
      values['emergency_message'].trim() === '') {
        emergencyMessageRef.current.focus();
        setEmergencyMessageError(() => ({error: true, message: 'Please enter the emergency message.'}));
        return false;
    }else{
      setEmergencyMessageError(() => ({error: false, message: ''}));
    }

    return true;
  }

  const handleSwitchChange = (event) => {
    if(!event.target.checked || (event.target.checked && validateErrorMessage())){
      setValues(data => ({
        ...data,
        mode_state: !values.emergency_mode,
        emergency: '',
      }));
      setShowDialog(true);
    }
  }

  const handleSaveMessage = () => {
    if (validateErrorMessage()) {
      updateEmergencyMode(token, values).then(result => {
        setValues(data => ({
          ...data,
          emergency_mode: result.data.emergency_mode,
          emergency_message: result.data.emergency_message,
          message: "Message updated successfully.",
          messageType: "success"
        }));
      }).catch(() => {
        setValues(data => ({
          ...data,
          message: "There was a problem while trying to update the settings.",
          messageType: "error",
        }));
      });
    }
  }

  const showAlert = () => {
    if(values.message){
      return (
        <Alert
          variant={values.messageType}
          message={values.message}
        />
      )
    }
  }

  return (
    <React.Fragment>
      <div className={classes.emergencyModeContainer}>
        {showAlert()}
        <Grid container spacing={3}>
          <Grid item xs={6} sm={6} md={6}>
            Emergency mode {values.emergency_mode ? 'on': 'off'}
            <Switch
              checked={values.emergency_mode}
              onChange={handleSwitchChange}
              value="emergency_mode"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <CustomInput
              id="emergency_message"
              errorDetails={{
                error: emergencyMessageError && emergencyMessageError.error ? true : false,
                message: emergencyMessageError ? emergencyMessageError.message : '',
              }}
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                inputRef: emergencyMessageRef,
                label: "Emergency message *",
                onChange: handleChange,
                name: "emergency_message",
                value: values.emergency_message ? values.emergency_message : '',
              }}
            />
            
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <div className={classes.buttons}>
              <Button variant="contained" onClick={handleSaveMessage} color="secondary">Save message</Button>
            </div>
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
          {`Are you sure you want to ${values.emergency_mode ? 'deactivate' : 'activate'} the emergency mode?`}
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
