import React, {
  useState,
  useEffect,
  useRef,
} from 'react';

import {
  useSelector,
} from 'react-redux';

// API
import { 
  getUsers,
  createUser,
  updateUser,
 } from 'api';

// Material UI components
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EditIcon from '@material-ui/icons/Edit';

// Custom UI Components
import CustomInput from "components/CustomInput/CustomInput";
import Label from "components/Label/Label";
import Alert from 'components/Alert/Alert';

// Utils
import { 
  isEmailValid
} from 'utils';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './UserManagementStyles';
const useStyles = makeStyles(styles);

const StatusTableCell = ({ user, loggedUser, handleAction }) => {
  if(user.email !== loggedUser.email) {

    const handleClick = () => {
      handleAction(user);
    }

    if (user.is_active) {
      return (
        <TableCell align="center">
          <Button size="small" variant="contained" color="default" onClick={handleClick}>
            Deactivate
          </Button>
        </TableCell>
      )
    }
  
    return (
      <TableCell align="center">
        <Button size="small" variant="outlined" primary="default" onClick={handleClick}>
          Activate
        </Button>
      </TableCell>
    )
  }

  return <TableCell />
  
}

const EditTableCell = ({ user, loggedUser, handleAction }) =>{
  if(user.email !== loggedUser.email) {

    const handleClick = () => {
      handleAction(user);
    }

    return (
      <TableCell align="center">
        <Button size="small" variant="contained" color="default" onClick={handleClick}>
          <EditIcon />
        </Button>
      </TableCell>
    )
  } 

  return <TableCell />

}

export default () => {
  const classes = useStyles();

  const emailRef = useRef(null);
  const firstNameRef = useRef(null);
  const agencyRef = useRef(null);
  const roleRef = useRef(null);
  const passRef = useRef(null);
  const passwordConfirmRef = useRef(null);

  const [data, setData] = useState({
    users: [],
    messageType: null,
    message: '',
  });
  const [filters, setFilters] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [values, setValues] = useState({});

  const token = useSelector(state => state.user.accessToken);
  const loggedUser = useSelector(state => state.user);

  useEffect(() => {
    getUsers(token, filters).then(resultSet => {
      setData(data => ({
        ...data,
        users: resultSet.data.results,
        roles: resultSet.data.roles,
        totalRecords: resultSet.data.total_records,
        totalPages: resultSet.data.total_pages,
        page: resultSet.data.page,
        hasNext: resultSet.data.has_next,
        hasPrev: resultSet.data.has_prev
      }));
    });
  }, [
    token,
    filters,
    filters.search,
    filters.page,
    data.message
  ]);

  const [emailError, setEmailError] = useState({error: false, message: ''});
  const [firstNameError, setFirstNameError] = useState({error: false, message: ''});
  const [agencyError, setAgencyError] = useState({error: false, message: ''});
  const [roleError, setRoleError] = useState({error: false, message: ''});
  const [passError, setPassError] = useState({error: false, message: ''});
  const [passConfirmError, setPassConfirmError] = useState({error: false, message: ''});

  const handleKeyPress = (event) => {
    event.persist();
    if (event.key === 'Enter') {
      setFilters(values => ({ ...values, [event.target.name]: event.target.value }));
    }
  }

  const handleStatusClick = (user) => {
    setValues({...user});
    setStatusDialogOpen(true);
  }

  const handleUpdateStatus = () => {
    updateUser(
      token,
      {...values, action: "status" }
    ).then(result => {
      if (result.data.email) {
        setData((data) => ({
          ...data,
          messageType: 'success',
          message: `User "${result.data.email}" was ${result.data.is_active ? "activated" : "deactivated" } successfully.`
        }));
      }else if (result.data.error){
        setData((data) => ({
          ...data,
          messageType: 'error',
          message: result.data.message
        }));
      }
    });
    setValues({});
    setStatusDialogOpen(false);
  }

  const handleEditClick = (user) => {
    setValues({...user});
    setDialogOpen(true);
  }

  const handleChangePage = (event, page) => {
    setFilters(data => ({...data, page: page + 1}));
  }

  const handleOpenDialog = () => {
      setDialogOpen(true);
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
  }

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

    if (!values['first_name']) {
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

    if (!values['role_id']) {
      roleRef.current.focus();
      setRoleError(() => ({error: true, message: "Please select a role."}));
      return false;
    }else{
      setRoleError(() => ({error: false, message: ''}));
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

  const handleSubmit = () => {
    if (isFormValid()){
      if(values.id) {
        // updateUser
        updateUser(
          token,
          values
        ).then(result => {
          if (result.data.email) {
            setData((data) => ({
              ...data,
              messageType: 'success',
              message: `User "${result.data.email}" was updated successfully.`
            }));
            
          }else if (result.data.error){
            setData((data) => ({
              ...data,
              messageType: 'error',
              message: result.data.message
            }));
          }
          setDialogOpen(false);
          setValues({});
        });
      } else {
        // createUser
        createUser(
          token,
          values
        ).then(result => {
          if (result.data.email) {
            setData((data) => ({
              ...data,
              messageType: 'success',
              message: `User "${result.data.email}" was created successfully.`
            }));
          }else if (result.data.error){
            setData((data) => ({
              ...data,
              messageType: 'error',
              message: result.data.message
            }));
          }
          setDialogOpen(false);
          setValues({});
        });
      }
    }
  }

  return (
    <React.Fragment>
      <Grid container spacing={3} >
        <Grid item xs={12} sm={12} md={12}>
          <h2 className={classes.title}>User Management</h2>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            <PersonAddIcon />
          </Button>
          {
            data.messageType ? (
              <div className={classes.messages}>
                <Alert
                  variant={data.messageType}
                  message={data.message}
                />
              </div>
            ) : null
          }
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <FormControl className={classes.formControl}>
            <div className={classes.inputContainer}>
              <InputBase
                className={classes.input}
                placeholder="Search"
                inputProps={{
                  'name': 'search',
                  'aria-label': 'search',
                  'onKeyPress': handleKeyPress,
                  'onChange': handleChange,
                  'value': values.search ? values.search : ''
                }}
              />
              <IconButton className={classes.iconButton} aria-label="search" onClick={() => {}}>
                <SearchIcon />
              </IconButton>
            </div>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">First Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Agency</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center">Last login</TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.users.map(user => (
                <TableRow key={user.id}>
                  <TableCell align="left">{user.first_name}</TableCell>
                  <TableCell align="left">{user.email}</TableCell>
                  <TableCell align="center">{user.agency}</TableCell>
                  <TableCell align="center">{user.role_name}</TableCell>
                  <TableCell align="center">{user.last_login}</TableCell>
                  <EditTableCell user={user} loggedUser={loggedUser} handleAction={handleEditClick} />
                  <StatusTableCell user={user} loggedUser={loggedUser} handleAction={handleStatusClick} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10]}
            count={data.users && data.totalRecords ? data.totalRecords : 0}
            component="div"
            page={data.users && data.page ? data.page - 1 : 0}
            rowsPerPage={10}
            backIconButtonProps={{
              'aria-label': 'previous page',
            }}
            nextIconButtonProps={{
              'aria-label': 'next page',
            }}
            onChangePage={handleChangePage}
          />
        </Grid>
      </Grid>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          User Info
        </DialogTitle>
        <DialogContent classes={{
          root: classes.dialogContent
        }}>
          <form>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={12}>
                <Label text="* Required fields" variant="caption" color="textSecondary" />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
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
                    value: values.email ? values.email : '',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
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
                    value: values.first_name ? values.first_name : '',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <CustomInput
                  id="last_name"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    label: "Last Name",
                    onChange: handleChange,
                    name: "last_name",
                    value: values.last_name ? values.last_name : '',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
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
                    value: values.agency ? values.agency : '',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Role *"
                  labelProps={{
                    htmlFor: "role"
                  }}
                  type="select"
                  id="role_id"
                  showNA={false}
                  options={data && data.roles ? data.roles.map(role => ({label: role.name, value: role.id})) : []}
                  errorDetails={{
                    error: roleError && roleError.error ? true : false,
                    message: roleError ? roleError.message : '',
                  }}
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    inputRef: roleRef,
                    onChange: handleChange,
                    name: "role_id",
                    value: values.role_id ? values.role_id : '',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
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
                    value: values.password ? values.password : '',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
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
                    value: values.confirm_password ? values.confirm_password : '',
                  }}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleDialogClose} color="primary">
            Close
          </Button>
          <Button variant="contained" onClick={handleSubmit} color="secondary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={statusDialogOpen}
        onClose={handleStatusDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Are you sure you want to ${values.is_active ? "deactivate" : "activate" } this user?`}
        </DialogTitle>
        <DialogActions>
          <Button variant="contained" onClick={handleStatusDialogClose} color="primary">
            No
          </Button>
          <Button variant="contained" onClick={handleUpdateStatus} color="secondary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>          
    </React.Fragment>
  );
}
