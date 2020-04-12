import React, {
  useState,
  useEffect,
} from 'react';
import { Redirect } from 'react-router-dom';
import clsx from 'clsx';

import {
  useSelector,
} from 'react-redux';

// API
import { 
  getProgram
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
import ProgramData from 'components/Program/ProgramData';
import Alert from 'components/Alert/Alert';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './ProgramDetailsStyles';
const useStyles = makeStyles(styles);

export default ({ match }) => {
  const classes = useStyles();

  const {
    params: { slug, agency }
  } = match;

  const user = useSelector(state => state.user);

  const [data, setData] = useState({
    program: null,
    showMissingData: false,
    error: false,
  });

  const [edit, setEdit] = useState(false);
  const [addAdvocacyReport, setAddAdvocacyReport] = useState(false);
  const [goSearch, setGoSearch] = useState(false);

  useEffect(() => {
    getProgram({
      property: 'slug',
      value: slug,
      agency: agency
    }).then(result => {
      setData(data => ({
        ...data,
        program: result.data.error ? null : result.data,
        error: result.data.error ? true : false
      }));
    }).catch(() => {
      // Show general error message
    })
  }, [
    slug,
    agency
  ]);

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

  if(edit) {
    const url = `/program/edit/${agency}/${slug}`
    return <Redirect push to={url} />
  }

  if(addAdvocacyReport) {
    const url = `/private/create/advocacy-report?menu=2&entity=program&id=${data.program.id}&agencyId=${data.program.agency}`;
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

  if(data.program && !data.error){
    return (
      <Container maxWidth="lg">
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
             control={<span>{`Last updated ${data.program.update_at}`}</span>}
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
                className={classes.button}
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
          <ProgramData program={data.program} showMissingData={data.showMissingData}/>
        </Paper>
      </Container>
    );
  }

  if(!data.program && data.error) {
    return (
      <Container maxWidth="lg">
        <div className={classes.messages}>
          <Alert
            variant={'info'}
            message={'Sorry, the program you are looking for no longer exists.'}
          />
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
