import React, {
  useState,
} from 'react';
import { Redirect } from 'react-router-dom';

import {
  useSelector,
} from 'react-redux';

// API
import { 
  createAgency
} from 'api'

// Material UI components
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

// Custom Components
import AgencyForm from 'components/Agency/AgencyForm';
import Alert from 'components/Alert/Alert';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './AgencyCreateStyles';
const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();

  const [formState, setFormState ] = useState({
    messageType: null,
    message: '',
    messageQueue: false,
  });

  const [goHome, setGoHome] = useState(false);
  const [goView, setGoView] = useState(false);

  const token = useSelector(state => state.user.accessToken);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  
  const handleSave = (data) => {
    createAgency(token, data).then((result) => {
      if(result && result.data.agency){
        setFormState(() => ({
          messageType: 'success',
          messageQueue: result.data.model === "queue" && !result.data.agency.emergency_mode ? true: false,
          message: `Agency "${result.data.agency.name}" was created successfully.`,
          agencySlug: result.data.agency.slug
        }));
      }
    }).catch(() => {
      // Pending: Show proper message from server
      setFormState(() => ({
        messageType: 'error',
        messageQueue: false,
        messageGeneral: true,
      }));
    });
  }

  const handleGoHome = () => {
    setGoHome(true);
  }

  const handleView = () => {
    setGoView(true);
  }

  if(goHome){
    return <Redirect push to="/" />
  }

  if(goView) {
    let url = `/agency/${formState.agencySlug}`
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
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleGoHome}
                  className={classes.button}
                >
                  Go to Homepage
                </Button>
                {
                  !formState.messageQueue ? (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleView}
                      className={classes.button}
                    >
                      View Agency
                    </Button>
                  ): null
                }
              </div>
            </div>
          ) : (
            <Paper className={classes.paper}>
              {
                formState.messageType === 'error' ? (
                  <Alert
                    variant={formState.messageType}
                    message={formState.message}
                    generalMessage={formState.messageGeneral}
                  />
                ) : null
              }
              <AgencyForm
                isAuthenticated={isAuthenticated} 
                title={'Create Agency'} 
                handleSave={handleSave}
              />
            </Paper>
          )
        }
    </Container>
  );
}
