import React, {
  useState,
  useRef,
} from 'react';

// Material UI components
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// Custom UI Components
import CustomInput from "components/CustomInput/CustomInput";

// Utils
import { 
  isEmailValid
} from 'utils';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './ProfileFormStyles';
const useStyles = makeStyles(styles);

const ProfileForm = ({userInfo, handleSubmit}) => {
  const classes = useStyles();

  const [values, setValues] = useState({...userInfo});

  const emailRef = useRef(null);
  const firstNameRef = useRef(null);
  const agencyRef = useRef(null);
  const oldPassRef = useRef(null);
  const passRef = useRef(null);
  const passwordConfirmRef = useRef(null);

  const [emailError, setEmailError] = useState({error: false, message: ''});
  const [firstNameError, setFirstNameError] = useState({error: false, message: ''});
  const [agencyError, setAgencyError] = useState({error: false, message: ''});
  const [oldPassError, setOldPassError] = useState({error: false, message: ''});
  const [passError, setPassError] = useState({error: false, message: ''});
  const [passConfirmError, setPassConfirmError] = useState({error: false, message: ''});

  const handleChange = (event) => {
    event.persist();
    setValues(values => ({ ...values, [event.target.name]: event.target.value }));
  }

  const isFormValid = () => {
    if(!values['email'] || !isEmailValid(values['email'])) {
      emailRef.current.focus();
      setEmailError(() => ({error: true, message: "Please enter a valid email."}));
      return false;
    }else{
      setEmailError(() => ({error: false, message: ''}));
    }

    if (!values['first_name'] || !values['first_name'].length) {
      firstNameRef.current.focus();
      setFirstNameError(() => ({error: true, message: "Please enter first name."}));
      return false;
    }else{
      setFirstNameError(() => ({error: false, message: ''}));
    }

    if (!values['agency']) {
      agencyRef.current.focus();
      setAgencyError(() => ({error: true, message: "Please enter agency name."}));
      return false;
    }else{
      setAgencyError(() => ({error: false, message: ''}));
    }

    if(values['password'] && !values["old_password"]){
      oldPassRef.current.focus();
      setOldPassError(() => ({error: true, message: "Please provide current password."}));
      return false;
    }else{
      setOldPassError(() => ({error: false, message: ''}));
    }

    if(values['password'] && values['password'] !== values['confirm_password']){
      passwordConfirmRef.current.focus();
      setPassConfirmError(() => ({error: true, message: "Password does not match confirmation."}));
      return false;
    }else{
      setPassConfirmError(() => ({error: false, message: ''}));
    }

    if(values['password'] && values['password'].length < 6){
      passRef.current.focus();
      setPassError(() => ({error: true, message: "Password should be at least 6 characters long"}));
      return false;
    }else{
      setPassError(() => ({error: false, message: ''}));
    }

    return true;
  }

  const handleClickSubmit = () => {
    if(isFormValid()){
      handleSubmit(values);
    }
  }

  return (
    <React.Fragment>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <CustomInput
              id="email"
              errorDetails={{
                error: emailError && emailError.error ? true : false,
                message: emailError ? emailError.message : '',
              }}
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                inputRef: emailRef,
                label: "Email *",
                onChange: handleChange,
                name: "email",
                value: values ? values.email : '',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomInput
              id="first_name"
              errorDetails={{
                error: firstNameError && firstNameError.error ? true : false,
                message: firstNameError ? firstNameError.message : '',
              }}
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                inputRef: firstNameRef,
                label: "First Name *",
                onChange: handleChange,
                name: "first_name",
                value: values ? values.first_name : '',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomInput
              id="last_name"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                label: "Last Name",
                onChange: handleChange,
                name: "last_name",
                value: values ? values.last_name : '',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomInput
              id="agency"
              formControlProps={{
                fullWidth: true
              }}
              errorDetails={{
                error: agencyError && agencyError.error ? true : false,
                message: agencyError ? agencyError.message : '',
              }}
              inputProps={{
                inputRef: agencyRef,
                label: "Agency *",
                onChange: handleChange,
                name: "agency",
                value: values ? values.agency : '',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <h3 className={classes.title}>Password</h3>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <CustomInput
              id="old_password"
              formControlProps={{
                fullWidth: true
              }}
              errorDetails={{
                error: oldPassError && oldPassError.error ? true : false,
                message: oldPassError ? oldPassError.message : '',
              }}
              inputProps={{
                inputRef: oldPassRef,
                type: "password",
                label: "Current Password",
                onChange: handleChange,
                name: "old_password",
                value: values && values.old_password ? values.old_password : '',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <CustomInput
              id="password"
              formControlProps={{
                fullWidth: true
              }}
              errorDetails={{
                error: passError && passError.error ? true : false,
                message: passError ? passError.message : '',
              }}
              inputProps={{
                inputRef: passRef,
                type: "password",
                label: "Password",
                onChange: handleChange,
                name: "password",
                value: values && values.password ? values.password : '',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <CustomInput
              id="confirm_password"
              errorDetails={{
                error: passConfirmError && passConfirmError.error ? true : false,
                message: passConfirmError ? passConfirmError.message : '',
              }}
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                inputRef: passwordConfirmRef,
                type: "password",
                label: "Confirm password",
                onChange: handleChange,
                name: "confirm_password",
                value: values && values.confirm_password ? values.confirm_password : '',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <div className={classes.buttons}>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={handleClickSubmit}
              >
                Save
              </Button>
            </div>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
}

export default ProfileForm;
