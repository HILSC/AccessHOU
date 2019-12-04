import React, {
  useState,
  useEffect,
} from 'react';
import { Redirect } from 'react-router-dom';
import clsx from 'clsx';

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

  const [data, setData] = useState({
    program: null,
    showMissingData: false,
    error: false,
  });
  const [edit, setEdit] = useState(false);

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
            <FormControlLabel classes={{
              root: classes.options
            }}
              control={
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleEdit}
                >
                  Help complete this profile
                </Button>
              }
              label=""
            />
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
