import React, {
  useEffect,
  useState,
} from 'react';
import { Redirect } from 'react-router-dom';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

// API
import { 
  updateProgram,
  getProgram,
  deleteProgram,
} from 'api';

// CONSTANTS
import {
  USER_ACTIONS
} from '../../constants';

// Material UI components
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom Components
import ProgramForm from 'components/Program/ProgramForm';
import Alert from 'components/Alert/Alert';

// Actions
import { LOGOUT } from 'actions/user';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './ProgramEditStyles';
const useStyles = makeStyles(styles);

export default ({ match }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  
  const {
    params: { slug }
  } = match;

  const [formState, setFormState ] = useState({
    program: null,
    message: '',
    messageType: null,    
    messageAction: null,
    messageQueue: false,
  });

  const [goHome, setGoHome] = useState(false);
  const [goView, setGoView] = useState(false);
  const [goEditor, setGoEditor] = useState(false);

  useEffect(() => { 
    getProgram({
      property: 'slug',
      value: slug
    }).then(result => {
      setFormState(data => ({
        ...data,
        program: result.data.error ? null : result.data,
        error: result.data.error ? true : false
      }));
    }).catch(() => {
      // Show general error message
    });
  }, [slug]);

  const token = useSelector(state => state.user.accessToken);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  
  const handleSave = (data) => {
    updateProgram(token, data).then((result) => {
      if(result.data.program) {
        setFormState(stateData => ({
          ...stateData,
          messageType: 'success',
          messageQueue: result.data.model === "queue" && !result.data.program.emergency_mode ? true: false,
          messageAction: USER_ACTIONS.UPDATE,
          message: `Program "${result.data.program.name}" was updated successfully.`,
          programSlug: result.data.program.slug
        }));
      }else if (result.data.error){
        setFormState((stateData) => ({
          ...stateData,
          messageType: 'error',
          messageQueue: false,
          message: result.data.message
        }));
      }
    }).catch((error) => {
       // Logout user
       dispatch({
        type: LOGOUT,
        data: null,
      });
    });
  }

  const handleDelete = (data) => {
    deleteProgram(token, data).then(result => {
      if(result.data) {
        setFormState(stateData => ({
          ...stateData,
          messageType: 'success',
          messageQueue: result.data.model === "queue" ? true: false,
          messageAction: USER_ACTIONS.DELETE,
          message: `Program "${result.data.program.name}" was deleted.`,
        }));
      } else if(result.data.error) {
        setFormState((stateData) => ({
          ...stateData,
          messageType: 'error',
          messageQueue: false,
          message: result.data.message
        }));
      }
    }).catch(() => {
      // Logout user
      dispatch({
        type: LOGOUT,
        data: null,
      });
    });
  }

  const handleGoHome = () => {
    setGoHome(true);
  }

  const handleGoEditor = () => {
    setGoEditor(true);
  }

  const handleView = () => {
    setGoView(true);
  }

  if(goHome) {
    return <Redirect push to="/" />
  }

  if(goEditor){
    return <Redirect push to="/editor" />
  }

  if(goView) {
    let url = `/program/${formState.programSlug}`
    return <Redirect push to={url} />
  }
  
  window.scrollTo(0, 0);

  if(formState.program && !formState.error){
    return (
      <Container maxWidth="lg">
          {
            formState.messageType === 'success' ? (
              <div className={classes.messages}>
                <Alert
                  variant={formState.messageType}
                  message={formState.message}
                  queueMessage={formState.messageQueue}
                />
                <div className={classes.buttons}>
                {
                  formState.messageAction === USER_ACTIONS.UPDATE ? (
                    <Button
                      variant="outlined"
                      onClick={handleView}
                      color="secondary"
                      className={classes.button}
                    >
                      View Program
                    </Button>
                  ) : 
                  (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleGoEditor}
                      className={classes.button}
                    >
                      Go to Editor
                    </Button>
                  )
                }
                  <Button
                    variant="outlined"
                    onClick={handleGoHome}
                    color="secondary"
                    className={classes.button}
                  >
                    Go to Homepage
                  </Button>
                </div>
              </div>
            ) : (
              <Paper className={classes.paper}>
                {
                  formState.messageType === 'error' ? (
                    <Alert
                      variant={formState.messageType}
                      message={formState.message}
                      queueMessage={formState.messageQueue}
                    />
                  ) : null
                }
                {
                  formState.program ? (
                    <ProgramForm
                      isAuthenticated={isAuthenticated} 
                      handleSave={handleSave}
                      handleDelete={handleDelete}
                      data={formState.program}
                    />
                  ) : null
                }
              </Paper>
            )
          }
      </Container>
    );
  }

  if(!formState.program && formState.error) {
    return (
      <Container maxWidth="lg">
        <div className={classes.messages}>
          <Alert
            variant={'info'}
            message={'Sorry, the program you are looking for no longer exists.'}
          />
          <div className={classes.buttons}>
            <Button
              variant="outlined"
              onClick={handleGoHome}
              className={classes.greenButton}
            >
              Go to Homepage
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <div className={classes.messages}>
        <CircularProgress className={classes.progress} color="primary" />
      </div>
    </Container>
  )

}