import React , {
  useEffect,
  useState,
  useRef,
} from 'react';

import { loadReCaptcha, ReCaptcha } from 'react-recaptcha-google';

import { NavLink } from "react-router-dom";

// Material UI Components
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormHelperText from "@material-ui/core/FormHelperText";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
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
  USA_STATES,
  YES_NO_OPTIONS,
  PROGRAM_SERVICES,
  DEFAULT_WEEKDAYS_TIME,
  INCOME_POVERTY_LEVEL_PERCENTS,
  CRISIS,
  IAI_MESSAGE,
} from "constants.js";

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './ProgramFormStyles';
const useStyles = makeStyles(styles);

export default ({ isAuthenticated, data, handleSave, handleDelete, isNew=false, showDeleteButton=true }) => {
  const classes = useStyles();

  const captchaEl = useRef(null);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const websiteRef = useRef(null);
  const requestorNameRef = useRef(null);
  const requestorEmailRef = useRef(null);

  const [values, setValues] = useState({
    ...data,
    'agency_id': data && data.agency ? data.agency.id : data.id,
    'program_id': data && data.agency ? data.id : null,
    'schedules': data ? data.schedule : DEFAULT_WEEKDAYS_TIME,
    'requested_by_email': '',
    'requested_by_name': '',
    'name': data && data.agency ? data.name : '',
    'state': data && data.state ? data.state.toLowerCase() : 'texas',
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

  const handleWalkInScheduleChanges = (walkInScheduleValues) => {
    setValues(values => ({ ...values, 'walk_in_schedule': { ...values['walk_in_schedule'], ...walkInScheduleValues } }));
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
      values['phone'].trim().length < 13) {
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

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();

    if (isFormValid()) {
      handleSave(values);
    }

  }

  const handleDeleteSubmit = (event) => {
    if (event) event.preventDefault();

    if(values && values.program_id) {
      handleDelete(values)
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
      <Typography variant="h4">
        {data.name}
      </Typography>
      {
        data && data.agency_name ? (
          <NavLink to={`/agency/${data.agency_slug}`} target="_blank" className={classes.agencyCustomLink}>
            {`A program from: ${data.agency_name}`}
          </NavLink>
        ) : null
      }
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <Label text="Program general Info" variant="h5" color="primary" />
          <Label text="* Required fields" variant="caption" color="textSecondary" />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
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
            id="description"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              label: "Description",
              onChange: handleChange,
              name: "description",
              value: values.description ? values.description : '',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <CustomInput
            type="multiselect"
            labelText="Service Types"
            id="service_types"
            options={PROGRAM_SERVICES}
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: handleChange,
              name: "service_types",
              value: values.service_types ? values.service_types : [],
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <CustomInput
            type="select"
            labelText="Is case management provided?"
            id="case_management_provided"
            options={YES_NO_OPTIONS}
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: handleChange,
              name: "case_management_provided",
              value: values.case_management_provided,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <CustomInput
            id="case_management_notes"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              label: "Case management notes",
              onChange: handleChange,
              name: "case_management_notes",
              value: values.case_management_notes ? values.case_management_notes : '',
              multiline: true,
              rows: 2
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
            type="select"
            labelText="State"
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
              rows: 2
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <CustomInput
            id="payment_service_cost"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              label: "Program service cost",
              onChange: handleChange,
              name: "payment_service_cost",
              value: values.payment_service_cost ? values.payment_service_cost : '',
              multiline: true,
              rows: 2
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
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
              rows: 2
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Label text="Program eligibility" variant="h5" color="primary" />
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
            labelInfo={{show: true, msg: IAI_MESSAGE}}
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
            id="zip_codes"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              label: "Zip Codes",
              onChange: handleChange,
              placeholder: 'Ex. 76705, 77005, 77060',
              name: "zip_codes",
              value: values.zip_codes ? values.zip_codes : '',
            }}
          />
          <FormHelperText>Zip codes, separated by comma.</FormHelperText>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <CustomInput
            type="select"
            labelText="Incomes (% of federal poverty level)"
            id="incomes_percent_poverty_level"
            options={INCOME_POVERTY_LEVEL_PERCENTS}
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: handleChange,
              name: "incomes_percent_poverty_level",
              value: values.incomes_percent_poverty_level ? values.incomes_percent_poverty_level : '',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Label text="Program requirements" variant="h5" color="primary" />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <CustomInput
            id="requires_enrollment_in"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              label: "Requires enrollment in",
              onChange: handleChange,
              name: "requires_enrollment_in",
              value: values.requires_enrollment_in ? values.requires_enrollment_in : '',
              multiline: true,
              rows: 2,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <CustomInput
            id="other_requirements"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              label: "Other",
              onChange: handleChange,
              name: "other_requirements",
              value: values.other_requirements ? values.other_requirements : '',
              multiline: true,
              rows: 2,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <CustomInput
            id="documents_required"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              label: "Documents required",
              onChange: handleChange,
              name: "documents_required",
              value: values.documents_required ? values.documents_required : '',
              multiline: true,
              rows: 2,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <CustomInput
            type="select"
            labelText="Appointment required?"
            id="appointment_required"
            options={YES_NO_OPTIONS}
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: handleChange,
              name: "appointment_required",
              value: values.appointment_required,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <CustomInput
            id="appointment_notes"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              label: "Appointment notes",
              onChange: handleChange,
              name: "appointment_notes",
              value: values.appointment_notes ? values.appointment_notes : '',
              multiline: true,
              rows: 2,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Label text="Program schedule" variant="h5" color="primary" labelInfo={{show: true, msg: IAI_MESSAGE}} />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <ScheduleForm
            handleScheduleChanges={handleScheduleChanges}
            values={values.schedules ? values.schedules : {}}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <h4>Walk in hours</h4>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <ScheduleForm
            handleScheduleChanges={handleWalkInScheduleChanges}
            values={values.walk_in_schedule ? values.walk_in_schedule : {}}
            autoPopulate={false}
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
              rows: 2,
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
              label: "Holiday schedule",
              onChange: handleChange,
              name: "holiday_schedule",
              value: values.holiday_schedule ? values.holiday_schedule : '',
              multiline: true,
              rows: 2,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Label text="Program languages" variant="h5" color="primary" />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <CustomInput
            type="multiselect"
            labelText="Program languages"
            id="languages"
            labelInfo={{show: true, msg: IAI_MESSAGE}}
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
        <Grid item xs={12} sm={12} md={12}>
          <Label text="Program services" variant="h5" color="primary" />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <CustomInput
            type="select"
            labelText="Are services available same day as intake?"
            id="service_same_day_intake"
            options={YES_NO_OPTIONS}
            labelInfo={{show: true, msg: IAI_MESSAGE}}
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: handleChange,
              name: "service_same_day_intake",
              value: values.service_same_day_intake,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <CustomInput
            id="intake_notes"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              label: "Intake notes",
              onChange: handleChange,
              name: "intake_notes",
              value: values.intake_notes ? values.intake_notes : '',
              multiline: true,
              rows: 2,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <CustomInput
            type="multiselect"
            labelText="Crisis?"
            id="crisis"
            options={CRISIS}
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: handleChange,
              name: "crisis",
              value: values.crisis ? values.crisis : [],
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <CustomInput
            type="select"
            labelText="Disaster response and/or recovery?"
            id="disaster_recovery"
            options={YES_NO_OPTIONS}
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: handleChange,
              name: "disaster_recovery",
              value: values.disaster_recovery,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <CustomInput
            id="transportation"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              label: "Transportation?",
              onChange: handleChange,
              name: "transportation",
              value: values.transportation ? values.transportation : '',
              multiline: true,
              rows: 2,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <CustomInput
            type="select"
            labelText="Client consult before completing paperwork?"
            id="client_consult"
            options={YES_NO_OPTIONS}
            labelInfo={{show: true, msg: IAI_MESSAGE}}
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: handleChange,
              name: "client_consult",
              value: values.client_consult,
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
            !isNew && showDeleteButton ? (
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
          Are you sure you want to delete this program?
        </DialogTitle>
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
