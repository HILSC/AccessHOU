import React , {
  useEffect,
  useState,
  useRef,
} from 'react';

import { loadReCaptcha, ReCaptcha } from 'react-recaptcha-google';

// Material UI Components
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormHelperText from "@material-ui/core/FormHelperText";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// Custom Components
import CustomInput from "components/CustomInput/CustomInput";
import ScheduleForm from "components/Schedule/ScheduleForm";
import Label from "components/Label/Label";

// Utils
import { 
  isEmailValid,
  isValidURL
} from 'utils';

import {
  LANGUAGES,
  AGE_GROUPS,
  IMMIGRATION_STATUSES,
  PROOF_OF_ADDRESS,
  STAFF_CULTURAL_TRAINING,
  USA_STATES,
  IDS,
  AVAILABLE_INTERPRETATION,
  YES_NO_OPTIONS,
  DEFAULT_WEEKDAYS_TIME,
  IAI_MESSAGE
} from "constants.js";

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './AgencyFormStyles';
const useStyles = makeStyles(styles);

export default ({ isAuthenticated, title, handleSave, handleDelete, agency, showDeleteButton=true }) => {
  const classes = useStyles();

  const captchaEl = useRef(null);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const websiteRef = useRef(null);
  const requestorNameRef = useRef(null);
  const requestorEmailRef = useRef(null);
  
  const [values, setValues] = useState({
    ...agency,
    'agency_id': agency && agency.id,
    'state': agency && agency.state ? agency.state.toLowerCase() : 'texas',
    'schedules': agency ? agency.schedule : DEFAULT_WEEKDAYS_TIME,
    'walk_in_schedule': agency ? agency.schedule : DEFAULT_WEEKDAYS_TIME,
    'requested_by_email': '',
    'requested_by_name': '',
  });

  const [nameError, setNameError] = useState({error: false, message: ''});
  const [websiteError, setWebsiteError] = useState({error: false, message: ''});
  const [phoneError, setPhoneError] = useState({error: false, message: ''});
  const [requestorNameError, setRequestorNameError] = useState({error: false, message: ''});
  const [requestorEmailError, setRequestorEmailError] = useState({error: false, message: ''});

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadReCaptcha();
  },[]);

  const handleScheduleChanges = (scheduleValues) => {
    setValues(values => ({ ...values, 'schedules': { ...values['schedules'], ...scheduleValues } }));
  }

  const handleChange = (event) => {
    event.persist();
    setValues(values => ({ ...values, [event.target.name]: event.target.value }));
  };

  const isFormValid = () => {
    if (!values['name'] ||
      values['name'].trim() === '') {
        nameRef.current.focus();
        setNameError(() => ({error: true, message: "Please enter a valid name."}));
        return false;
    }else{
      setNameError(() => ({error: false, message: ''}));
    }

    if(values['website'] && values['website'] !== ''){
      if(!isValidURL(values['website'])) {
        websiteRef.current.focus();
        setWebsiteError(() => ({error: true, message: "Please enter a valid website."}));
        return false;
      }
    }

    if (!values['phone'] ||
      values['phone'].trim().length < 14) {
        phoneRef.current.focus();
        setPhoneError(() => ({error: true, message: "Please enter a valid phone."}));
        return false;
    }else{
      setPhoneError(() => ({error: false, message: ''}));
    }

    if(!isAuthenticated) {
      if(!values['requested_by_name']) {
        requestorNameRef.current.focus();
        setRequestorNameError(() => ({error: true, message: "Please enter your name."}));
        return false;
      }else{
        setRequestorNameError(() => ({error: false, message: ''}));
      }
    }

    if(!isAuthenticated) {
      if(!values['requested_by_email'] || !isEmailValid(values['requested_by_email'])) {
        requestorEmailRef.current.focus();
        setRequestorEmailError(() => ({error: true, message: "Please enter a valid email."}));
        return false;
      }else{
        setRequestorEmailError(() => ({error: false, message: ''}));
      }
    }

    return true;
  }

  const handleSubmit =  async (event) => {
    if (event) event.preventDefault();

    if (isFormValid()) {
      handleSave(values);
    }
  }

  const handleDeleteSubmit = (event) => {
    if (event) event.preventDefault();

    if(values && values.agency_id) {
      handleDelete(values);
    }
  }

  const handleOpenDialog = () => {
    if(isAuthenticated) {
      setDialogOpen(true);
    }else{
      if(isFormValid()){
        setDialogOpen(true);
      }
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  return (
    <Container>
      <Typography component="h4" variant="h4">
        {title}
      </Typography>
      <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={12}>
              <Label text="General Info" variant="h5" color="primary" />
              <Label text="* Required fields" variant="caption" color="textSecondary" />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <CustomInput
                id="name"
                errorDetails={{
                  error: nameError && nameError.error ? true : false,
                  message: nameError ? nameError.message : '',
                }}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  inputRef: nameRef,
                  label: "Name *",
                  onChange: handleChange,
                  name: "name",
                  value: values.name ? values.name : '',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CustomInput
                id="website"
                errorDetails={{
                  error: websiteError && websiteError.error ? true : false,
                  message: websiteError ? websiteError.message : '',
                }}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  label: "Website",
                  inputRef: websiteRef,
                  onChange: handleChange,
                  name: "website",
                  value: values.website ? values.website : '',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CustomInput
                type="phone"
                labelText="Phone *"
                id="phone"
                errorDetails={{
                  error: phoneError && phoneError.error ? true : false,
                  message: phoneError ? phoneError.message : '',
                }}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  inputRef: phoneRef,
                  onChange: handleChange,
                  name: "phone",
                  value: values.phone ? values.phone : '',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <CustomInput
                id="street"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  label: "Address",
                  onChange: handleChange,
                  name: "street",
                  value: values.street ? values.street : '',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <CustomInput
                id="city"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  label: "City",
                  onChange: handleChange,
                  name: "city",
                  value: values.city ? values.city : '',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <CustomInput
                labelText="State"
                type="select"
                id="state"
                options={USA_STATES.map(state => state.name)}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: handleChange,
                  name: "state",
                  value: values.state ? values.state : '',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <CustomInput
                id="zip_code"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  label: "Zip Code",
                  onChange: handleChange,
                  name: "zip_code",
                  value: values.zip_code ? values.zip_code : '',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CustomInput
                id="next_steps"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  label: "Next steps for client to take",
                  onChange: handleChange,
                  name: "next_steps",
                  value: values.next_steps ? values.next_steps : '',
                  multiline: true,
                  rows: 3
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CustomInput
                id="payment_options"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  label: "Payment options",
                  onChange: handleChange,
                  name: "payment_options",
                  value: values.payment_options ? values.payment_options : '',
                  multiline: true,
                  rows: 3
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Label text="Eligibility" variant="h5" color="primary" />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CustomInput
                type="multiselect"
                labelText="Age groups"
                id="age_groups"
                options={AGE_GROUPS}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: handleChange,
                  name: "age_groups",
                  value: values.age_groups ? values.age_groups : []
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CustomInput
                type="multiselect"
                labelText="Immigration status(es)"
                id="immigration_statuses"
                options={IMMIGRATION_STATUSES}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: handleChange,
                  name: "immigration_statuses",
                  value: values.immigration_statuses ? values.immigration_statuses : [],
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CustomInput
                id="gender"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  label: "Gender",
                  onChange: handleChange,
                  name: "gender",
                  value: values.gender ? values.gender : '',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CustomInput
                id="zip_codes"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  label: "Zip Codes",
                  placeholder: 'Ex. 76705, 77005, 77060',
                  onChange: handleChange,
                  name: "zip_codes",
                  value: values.zip_codes ? values.zip_codes : '',
                }}
              />
              <FormHelperText>Zip codes, separated by comma.</FormHelperText>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Label text="Requirements" variant="h5" color="primary" />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CustomInput
                type="multiselect"
                labelText="IDs accepted -- current"
                id="accepted_ids_current"
                options={IDS}
                labelInfo={{show: true, msg: IAI_MESSAGE}}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: handleChange,
                  name: "accepted_ids_current",
                  value: values.accepted_ids_current ? values.accepted_ids_current : [],
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CustomInput
                type="multiselect"
                labelText="IDs accepted -- expired"
                id="accepted_ids_expired"
                options={IDS}
                labelInfo={{show: true, msg: IAI_MESSAGE}}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: handleChange,
                  name: "accepted_ids_expired",
                  value: values.accepted_ids_expired ? values.accepted_ids_expired : [],
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <CustomInput
                id="notes"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  label: "Notes",
                  onChange: handleChange,
                  name: "notes",
                  value: values.notes ? values.notes : '',
                  multiline: true,
                  rows: 3,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <CustomInput
                type="multiselect"
                labelText="Proof of address?"
                id="proof_of_address"
                options={PROOF_OF_ADDRESS}
                labelInfo={{show: true, msg: IAI_MESSAGE}}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: handleChange,
                  name: "proof_of_address",
                  value: values.proof_of_address && values.proof_of_address[0] !== null ? values.proof_of_address : [],
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Label text="Schedule" variant="h5" color="primary" />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <ScheduleForm
                handleScheduleChanges={handleScheduleChanges}
                values={values.schedules ? values.schedules : {}}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CustomInput
                id="schedule_notes"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  label: "Notes",
                  onChange: handleChange,
                  name: "schedule_notes",
                  value: values.schedule_notes ? values.schedule_notes : '',
                  multiline: true,
                  rows: 3,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CustomInput
                id="holiday_schedule"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  label: "Holiday Schedule",
                  onChange: handleChange,
                  name: "holiday_schedule",
                  value: values.holiday_schedule ? values.holiday_schedule : '',
                  multiline: true,
                  rows: 3,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Label text="Languages" variant="h5" color="primary" />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CustomInput
                type="multiselect"
                labelText="Agency Languages"
                id="languages"
                options={LANGUAGES}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: handleChange,
                  name: "languages",
                  value: values.languages ? values.languages : [],
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CustomInput
                type="multiselect"
                labelText="Documents"
                id="documents_languages"
                options={LANGUAGES}
                labelInfo={{show: true, msg: IAI_MESSAGE}}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: handleChange,
                  name: "documents_languages",
                  value: values.documents_languages ? values.documents_languages : [],
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CustomInput
                type="multiselect"
                labelText="Website"
                id="website_languages"
                options={LANGUAGES}
                labelInfo={{show: true, msg: IAI_MESSAGE}}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: handleChange,
                  name: "website_languages",
                  value: values.website_languages ? values.website_languages : [],
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CustomInput
                type="multiselect"
                labelText="Frontline Staff"
                id="frontline_staff_languages"
                options={LANGUAGES}
                labelInfo={{show: true, msg: IAI_MESSAGE}}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: handleChange,
                  name: "frontline_staff_languages",
                  value: values.frontline_staff_languages ? values.frontline_staff_languages : [],
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <CustomInput
                type="multiselect"
                labelText="Interpretation Available?"
                id="interpretations_available"
                options={AVAILABLE_INTERPRETATION}
                labelInfo={{show: true, msg: IAI_MESSAGE}}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: handleChange,
                  name: "interpretations_available",
                  value: values.interpretations_available ? values.interpretations_available : [],
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Label text="Services" variant="h5" color="primary" />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CustomInput
                type="select"
                labelText="Assistance to fill out intake forms?"
                id="assistance_with_forms"
                options={YES_NO_OPTIONS}
                labelInfo={{show: true, msg: IAI_MESSAGE}}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: handleChange,
                  name: "assistance_with_forms",
                  value: values.assistance_with_forms ? values.assistance_with_forms : '',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CustomInput
                type="select"
                labelText="Visual aids for low-literacy clients?"
                id="visual_aids"
                options={YES_NO_OPTIONS}
                labelInfo={{show: true, msg: IAI_MESSAGE}}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: handleChange,
                  name: "visual_aids",
                  value: values.visual_aids ? values.visual_aids : '',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <CustomInput
                type="select"
                labelText="ADA accessible?"
                id="ada_accessible"
                options={YES_NO_OPTIONS}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: handleChange,
                  name: "ada_accessible",
                  value: values.ada_accessible ? values.ada_accessible : '',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <CustomInput
                type="select"
                labelText="Policy for response to Immigrations and Customs Enforcement requests?"
                id="response_requests"
                options={YES_NO_OPTIONS}
                labelInfo={{show: true, msg: IAI_MESSAGE}}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: handleChange,
                  name: "response_requests",
                  value: values.response_requests ? values.response_requests : '',
                }}
              />
              <FormHelperText>For example, <a href="https://www.houstonimmigration.org/disaster-resources-for-immigrants/#AdvocateResources" target="_blank" rel="noopener noreferrer">please see here</a></FormHelperText>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <CustomInput
                type="select"
                labelText="Staff cultural competency/effectiveness training?"
                id="cultural_training"
                options={STAFF_CULTURAL_TRAINING}
                labelInfo={{show: true, msg: IAI_MESSAGE}}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: handleChange,
                  name: "cultural_training",
                  value: values.cultural_training ? values.cultural_training : [],
                }}
              />
            </Grid>
            {
              isAuthenticated ? null : (
                  <Grid item xs={12} sm={12} md={12}>
                    <Label text="Your information" variant="h5" color="primary" />
                  </Grid>
              )
            }
            {
              isAuthenticated ? null : (
                <Grid item xs={12} sm={12} md={6}>
                  <CustomInput
                    id="requested_by_name"
                    errorDetails={{
                      error: requestorNameError && requestorNameError.error ? true : false,
                      message: requestorNameError ? requestorNameError.message : '',
                    }}
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      inputRef: requestorNameRef,
                      label: "Please provide your name *",
                      onChange: handleChange,
                      name: "requested_by_name",
                      value: values.requested_by_name ? values.requested_by_name : [],
                    }}
                  />
                </Grid>
              )
            }
            {
              isAuthenticated ? null : (
                <Grid item xs={12} sm={12} md={6}>
                  <CustomInput
                    id="requested_by_email"
                    errorDetails={{
                      error: requestorEmailError && requestorEmailError.error ? true : false,
                      message: requestorEmailError ? requestorEmailError.message : '',
                    }}
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      inputRef: requestorEmailRef,
                      label: "Please provide your email *",
                      onChange: handleChange,
                      name: "requested_by_email",
                      value: values.requested_by_email ? values.requested_by_email : [],
                    }}
                  />
                </Grid>
              )
            }
            <Grid item xs={12} sm={12} md={12}>
              <div className={classes.buttons}>
              {
                values.agency_id && showDeleteButton ? 
                (
                  <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  className={classes.button}
                  onClick={handleOpenDialog}
                >
                  Delete
                </Button>
                ) : null
              }
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  className={classes.button}
                >
                  Save
                </Button>
              </div>
              </Grid>
          </Grid>
        </form>
      <ReCaptcha
          ref={captchaEl}
          size="invisible"
          render="explicit"
          sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
      />
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete this agency?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting this agency will delete all the programs related to it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleDialogClose} color="secondary">
            No
          </Button>
          <Button variant="contained" onClick={handleDeleteSubmit} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
