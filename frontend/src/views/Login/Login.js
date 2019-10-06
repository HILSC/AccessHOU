import React, {
  useState,
  useRef,
} from 'react';
import { Redirect } from 'react-router-dom';
import { 
  useDispatch,
  useSelector,
} from 'react-redux';

// API
import { 
  signInAction
} from 'actions/user';

// Material UI Components
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';

// Components
import CustomInput from "components/CustomInput/CustomInput.js";
import Alert from 'components/Alert/Alert';

// Utils
import { isEmailValid } from 'utils';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './LoginStyles';
const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const authenticationError = useSelector(state => state.user.error);
  const dispatch = useDispatch();

  const [values, setValues] = useState({});

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [emailError, setEmailError] = useState({error: false, message: ''});
  const [passwordError, setPasswordError] = useState({error: false, message: ''});
  
  const handleChange = (event) => {
    event.persist();
    setValues(values => ({ ...values, [event.target.name]: event.target.value }));
  };

  const isFormValid = () => {
    if(!values['email'] || !isEmailValid(values['email'])) {
        emailRef.current.focus();
        setEmailError(() => ({error: true, message: "Please enter a valid email."}));
        return false;
    }else{
      setEmailError(() => ({error: false, message: ''}));
    }

    if (!values['password'] || values['password'].trim() === '') {
        passwordRef.current.focus();
        setPasswordError(() => ({error: true, message: "Please enter password."}));
        return false;
    }else{
      setPasswordError(() => ({error: false, message: ''}));
    }

    return true;
  }

  const handleSubmit = (event) => {
    if (event) event.preventDefault();

    if(isFormValid()) {
      dispatch(signInAction(values));
    }
  }

  if (isAuthenticated) {
    return <Redirect push to='/editor' />
  }

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Paper className={classes.paper}>
        {
          authenticationError ? (
            <Alert
              variant={"error"}
              message={"Incorrect credentials. Please try again."}
            />
          ) : null
        }
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form onSubmit={handleSubmit}>
          <CustomInput
            id="email"
            errorDetails={{
              error: emailError && emailError.error ? true : false,
              message: emailError ? emailError.message : '',
            }}
            formControlProps={{
              fullWidth: true
            }}
            autoFocus={true}
            inputProps={{
              label: "Email",
              inputRef: emailRef,
              onChange: handleChange,
              name: "email",
              value: values && values.email ? values.email : '',
            }}
          />
          <CustomInput
            id="password"
            errorDetails={{
              error: passwordError && passwordError.error ? true : false,
              message: passwordError ? passwordError.message : '',
            }}
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              label: "Password",
              inputRef: passwordRef,
              onChange: handleChange,
              name: "password",
              value: values && values.password ? values.password : '',
              type: "password"
            }}
          />
          <div className={classes.buttonContainer}>
            <Button type="submit" variant="contained" color="secondary">Continue</Button>
          </div>
        </form>
      </Paper>
    </Container>
  );
}
