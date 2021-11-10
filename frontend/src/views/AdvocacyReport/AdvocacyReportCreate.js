import React, {
  useState
} from 'react';

import {
  useSelector,
} from 'react-redux';

import queryString from 'query-string';

// API
import {
  createAdvocacyReport
} from 'api'

// Material UI components
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

// Custom Components
import AdvocacyReportForm from 'components/AdvocacyReport/AdvocacyReportForm';
import Alert from 'components/Alert/Alert';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './AdvocacyReportCreateStyles';
const useStyles = makeStyles(styles);

export default ({ location }) => {
  const classes = useStyles();

  const queryValues = queryString.parse(location.search);
  const entity = queryValues.entity;
  const entityId = queryValues.id;
  const agencyId = queryValues.agencyId;

  const token = useSelector(state => state.user.accessToken);
  const userName = useSelector(state => state.user.name);

  const [formState, setFormState ] = useState({
    messageType: null,
    message: '',
  });

  const handleSave = (data) => {
    createAdvocacyReport(token, data).then((result) => {
      setFormState(() => ({
        messageType: 'success',
        message: result.data.message
      }));
    }).catch(() => {
      setFormState(() => ({
        messageType: 'error',
        message: 'Error. Advocacy report cannot be create at this moment.'
      }));
    });
  }

  const handleAddNew = () => {
    setFormState(() => ({
      messageType: null,
      message: ''
    }));
  }

  return (
    <Container maxWidth="lg">
      <Paper className={classes.paper}>
        {
          formState.messageType ? (
            <Alert message={formState.message} variant={formState.messageType} />
          ) : null
        }
        {
          formState.messageType && formState.messageType === 'success' ? (
            <div className={classes.buttons}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleAddNew}
                className={classes.button}
              >
              Add New Advocacy Report
              </Button>
            </div>
          ) : (
            <AdvocacyReportForm
              handleSave={handleSave}
              userName={userName}
              entity={entity ? entity : 'agency'}
              entityId={entityId}
              agencyId={agencyId}
            />
          )
        }
      </Paper>
    </Container>
  );
}
