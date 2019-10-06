import React from 'react';

// Material UI components
import Container from '@material-ui/core/Container';

// Custom Components
import Alert from 'components/Alert/Alert';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './NotFoundStyles';
const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <div className={classes.paper}>
        <Alert
          variant={"info"}
          message={"Sorry, the page you are looking for doesn't exist."}
        />
      </div>
    </Container>
  );
}
