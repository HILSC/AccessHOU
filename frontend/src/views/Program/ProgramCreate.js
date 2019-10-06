import React, {
  useEffect,
  useState,
} from 'react';
import { Redirect } from 'react-router-dom';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

// Custom hooks
import useDebounce from 'customhooks/useDebounce';

// API
import {
  getAgencies,
  getAgency,
  createProgram
} from 'api'

// Material UI components
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// Custom Components
import Autocomplete from 'components/Autocomplete/Autocomplete';
import ProgramForm from 'components/Program/ProgramForm';
import Alert from 'components/Alert/Alert';

// Actions
import { LOGOUT } from 'actions/user';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './ProgramCreateStyles';
const useStyles = makeStyles(styles);

export default ({ match }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    params: { agencySlug }
  } = match;

  const token = useSelector(state => state.user.accessToken);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);

  const [searchAgencyTerm, setsearchAgencyTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState({value: agencySlug});

  const [goHome, setGoHome] = useState(false);
  const [goView, setGoView] = useState(false);

  const [data, setData] = useState({
    agencies: [],
    agency: null,
    messageType: null,
    message: '',
    messageQueue: false,
  })

  const debouncedsearchAgencyTerm = useDebounce(searchAgencyTerm, 1000);

  // Get agencies based on search
  useEffect(() => {
    if (debouncedsearchAgencyTerm) {
      getAgencies({
        property: 'name',
        value: searchAgencyTerm,
        page: 1
      }).then(results => {
        if(Array.isArray(results.data.results) && results.data.results.length){
          const agencies = results.data.results.map(agency => ({value: agency.fields.slug, label: agency.fields.name}));
          setData(data => ({
            ...data,
            agencies: agencies
          }));
        }
      });
    }
  }, [debouncedsearchAgencyTerm, searchAgencyTerm]);

  //Get selected Agency
  useEffect(() => {
    if(selectedAgency && selectedAgency.value){
      getAgency({
        property: 'slug',
        value: selectedAgency.value
      }).then(result => {
        setData(data => ({
          ...data,
          agency: result.data,
          messageType: '',
          messageQueue: false,
          message: ''
        }));
      });
    }
  }, [selectedAgency]);

  const handleSelect = (agencySelected) => {
    setSelectedAgency(agencySelected);
  };

  const handleSearch = (searchText) => {
    setsearchAgencyTerm(searchText);
  }

  const handleSave = (data) => {
    createProgram(token, data).then((result) => {
      if(result && result.data.program){
        setData((stateData) => ({
          ...stateData,
          agencies: [],
          agency:null,
          programSlug: result.data.program.slug,
          messageType: 'success',
          messageQueue: result.data.model === "queue" && !result.data.program.emergency_mode ? true: false,
          message: `Program "${result.data.program.name}" was created successfully under agency "${stateData.agency.name}".`
        }));
      }else if (result.data.error){
        setData((stateData) => ({
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

  const handleGoHome = () => {
    setGoHome(true);
  }

  const handleView = () => {
    setGoView(true);
  }

  if(goHome) {
    return <Redirect push to="/" />
  }

  if(goView) {
    let url = `/program/${data.programSlug}`
    return <Redirect push to={url} />
  }

  window.scrollTo(0, 0);

  return (
    <Container maxWidth="lg">
        {
          agencySlug || data.messageType === 'success' ? null : (
            <Paper className={classes.paper}>
              <Typography variant="h5">
                Search Agency
              </Typography>
              <Autocomplete
                placeholder={"Enter agency name here"}
                suggestions={data.agencies}
                handleSelect={handleSelect}
                handleChange={handleSearch}
              />
            </Paper>
          )
        }
        {
          data.messageType === 'success' ? (
            <div className={classes.messages}>
              <Alert
                variant={data.messageType}
                message={data.message}
                queueMessage={data.messageQueue}
              />
              <div className={classes.buttons}>
                <Button
                  variant="outlined"
                  onClick={handleGoHome}
                  color="secondary"
                  className={classes.button}
                >
                  Go to Homepage
                </Button>
                {
                  !data.messageQueue ? (
                    <Button
                      variant="outlined"
                      onClick={handleView}
                      color="secondary"
                      className={classes.button}
                    >
                      View Program
                    </Button>
                  ) : null
                }
              </div>
            </div>
          ) : null
        }
        {
          data.agency ? (
            <Paper className={classes.paper}>
                {
                  data.messageType === 'error' ? (
                    <Alert
                      variant={data.messageType}
                      message={data.message}
                    />
                  ) : null
                }
                <ProgramForm
                  isAuthenticated={isAuthenticated}
                  handleSave={handleSave}
                  data={data.agency}
                  isNew={true}
                />
            </Paper>
          ) : null
        }
    </Container>
  );
}
