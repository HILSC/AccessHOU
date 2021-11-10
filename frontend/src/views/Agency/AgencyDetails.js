import React, {
  useState,
  useEffect,
} from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import clsx from 'clsx';

import {
  useSelector,
} from 'react-redux';

// API
import {
  getAgency
} from 'api';

// Material UI components
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom components
import AgencyData from 'components/Agency/AgencyData';
import Alert from 'components/Alert/Alert';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './AgencyDetailsStyles';
const useStyles = makeStyles(styles);

export default (props) => {

    const { match } = props;

    const history = useHistory();

  const classes = useStyles();

  const {
    params: { slug }
  } = match;

  const user = useSelector(state => state.user);
  const token = useSelector(state => state.user.accessToken);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);

  const [data, setData] = useState({
    agency: null,
    showMissingData: false,
    error: false,
  });

  const [formState, setFormState ] = useState({
    agency: null,
    message: '',
    messageType: null,
    messageAction: null,
    messageQueue: false,
    agencySlug: false,
  });

  const [edit, setEdit] = useState(false);
  const [goSearch, setGoSearch] = useState(false);
  const [addAdvocacyReport, setAddAdvocacyReport] = useState(false);
  const [addProgram, setAddProgram] = useState(false);

  useEffect(() => {
      if (props.location?.state?.initialMessage)
          setFormState( data => ({ ...data, ...props.location.state.initialMessage }));
  }, []);

  useEffect(() => {
    getAgency({property: 'slug', value: slug}).then(result => {
      setData(oldData => ({
        ...oldData,
        agency: result.data.error ? null : result.data,
        error: result.data.error ? true : false,
      }));
    }).catch(() => {
      setData(data => ({
        ...data,
        error: true
      }));
    })
  }, [slug]);

  // const handleCopy = (data) => {
  //     copyAgency({property: 'slug', value: slug}).then(result => {
  //         console.log(result.data.slug);
  //         history.push(result.data.slug);
  //       setFormState( data => ({ ...data,
  //           messageType: 'success',
  //           message: 'Agency copied successfully! You can edit the agency by clicking the edit button below.',
  //           agencySlug: result.data.slug
  //       }))
  //     }).catch(() => {
  //         setFormState(data => ({
  //           ...data,
  //           messageType: 'error',
  //           message: 'There was a problem copying this agency.'
  //         }));
  //     })
  // }

  const handleEdit = () => {
    setEdit(true);
  }

  const handleGoSearch = () => {
    setGoSearch(true);
  }

  const handleAdvocacyReport = () => {
    setAddAdvocacyReport(true)
  }

  const handleShowMissingData = () => {
    setData(data => ({
      ...data,
      showMissingData: !data.showMissingData
    }));
  }

  const handleAddProgram = () => {
    setAddProgram(true);
  }

  if(edit) {
    const url = `/agency/edit/${slug}`;
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

  if(addProgram) {
    const url = `/program/create/${slug}`;
    return <Redirect push to={url} />
  }

  if(addAdvocacyReport) {
    const url = `/private/create/advocacy-report?menu=2&entity=agency&id=${data.agency.id}`;
    return <Redirect push to={url} />
  }

  if (data.agency && !data.error) {
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
            </div>
            ) : ''
        }
        <Paper className={classes.paper}>
          <FormGroup>
            <FormControlLabel classes={{
              root: classes.options
            }}
              control={
                <Switch checked={data.showMissingData} onChange={handleShowMissingData} />
              }
              label="Show missing data"
            />
            <FormControlLabel classes={{
              root: clsx(classes.options, classes.lastUpdated)
            }}
             control={<span>{`Last updated ${data.agency.update_at}`}</span>}
             label={''}
            >
            </FormControlLabel>
            <div className={classes.options}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleEdit}
                className={classes.button}
              >
                Help complete this profile
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleGoSearch}
                className={ classes.button}
              >
                Go back to search results
              </Button>
              {
                user.isAuthenticated && user.advocacyReport ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleAdvocacyReport}
                    className={classes.button}
                  >
                    Add advocacy report
                  </Button>
                ) : null
              }
            </div>
          </FormGroup>
          <AgencyData agency={data.agency} showMissingData={data.showMissingData} />
          <Container maxWidth="lg">
            <div className={classes.messages}>
              <Button variant="contained" color="primary" onClick={handleAddProgram}>
                Add program
              </Button>
            </div>
          </Container>
        </Paper>
      </Container>
    );
  }

  if(!data.agency && data.error) {
    return (
      <Container maxWidth="lg">
        <div className={classes.messages}>
          <Alert
            variant={'info'}
            message={'Sorry, the agency you are looking for no longer exists.'}
          />
        </div>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Paper className={classes.paper}>
          <CircularProgress className={classes.progress} color="primary" />
      </Paper>
    </Container>
  )
}
