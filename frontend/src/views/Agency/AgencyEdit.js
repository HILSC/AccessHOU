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
  updateAgency,
  getAgency,
  deleteAgency,
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
import AgencyForm from 'components/Agency/AgencyForm';
import Alert from 'components/Alert/Alert';

// ACTIONS
import { LOGOUT } from 'actions/user';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './AgencyEditStyles';
const useStyles = makeStyles(styles);

export default ({ match }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    params: { slug }
  } = match;
  
  const [formState, setFormState ] = useState({
    agency: null,
    message: '',
    messageType: null,
    messageAction: null,
    messageQueue: false
  });

  const [goHome, setGoHome] = useState(false);
  const [goView, setGoView] = useState(false);
  const [goEditor, setGoEditor] = useState(false);
  const [goSearch, setGoSearch] = useState(false);

  useEffect(() => {
    getAgency({property: 'slug', value: slug}).then(result => {
      setFormState(data => ({
        ...data,
        'agency': result.data
      }));
    }).catch(() => {
      setFormState(data => ({
        ...data,
        messageType: 'error',
        message: 'There is a problem getting the agency details.'
      }));
    });
  }, [slug]); 

  const token = useSelector(state => state.user.accessToken);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  
  const handleSave = (data) => {
    updateAgency(token, data).then((result) => {
      if(result.data.agency) {
        setFormState(stateData => ({
          ...stateData,
          messageType: 'success',
          messageQueue: result.data.model === "queue" && !result.data.agency.emergency_mode ? true: false,
          messageAction: USER_ACTIONS.UPDATE,
          message: `Agency "${result.data.agency.name}" was updated successfully.`,
          agencySlug: result.data.agency.slug
        }));
      }else if (result.data.error){
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

  const handleDelete = (data) => {
    deleteAgency(token, data).then(result => {
      if(result.data) {
        setFormState(stateData => ({
          ...stateData,
          messageType: 'success',
          messageQueue: result.data.model === "queue" ? true: false,
          messageAction: USER_ACTIONS.DELETE,
          message: `Agency "${result.data.agency.name}" was deleted.`,
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

  const handleGoSearch = () => {
    setGoSearch(true)
  }

  if(goHome){
    return <Redirect push to="/" />
  }

  if(goEditor){
    return <Redirect push to="/editor" />
  }

  if(goView) {
    let url = `/agency/${formState.agencySlug}`
    return <Redirect push to={url} />
  }

  if(goSearch) {
    let url = `/search/?`;

    if (localStorage.getItem('search')){
      url += `keyword=${localStorage.getItem('search')}&`;
    }

    url += `entity=${localStorage.getItem('entity')}&storage=1`;

    return <Redirect push to={url} />
  }
  
  window.scrollTo(0, 0);

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
                    <React.Fragment>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleView}
                        className={classes.button}
                      >
                        View agency
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleGoSearch}
                        className={classes.button}
                      >
                        Go back to search results
                      </Button>
                    </React.Fragment>
                  ) : (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleGoEditor}
                      className={classes.button}
                    >
                      Go back to editor
                    </Button>
                  )
                }
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleGoHome}
                  className={classes.button}
                >
                  Go back to homepage
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
                formState.agency ? (
                  <AgencyForm
                    isAuthenticated={isAuthenticated} 
                    title={'Update Agency'} 
                    handleSave={handleSave}
                    handleDelete={handleDelete}
                    agency={formState.agency}
                  />
                ) : (
                  <div className={classes.messages}>
                    <CircularProgress className={classes.progress} color="primary" />
                  </div>
                )
              }
            </Paper>
          )
        }
    </Container>
  );
}
