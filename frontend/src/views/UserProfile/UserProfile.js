import React, {
  useState,
  useEffect,
} from 'react';

import {
  useSelector,
} from 'react-redux';

// API
import { 
  getUserProfile,
  updateUserProfile,
 } from 'api';

// Material UI components
import Grid from '@material-ui/core/Grid';

// Custom UI Components
import Alert from 'components/Alert/Alert';
import ProfileForm from './ProfileForm';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './UserProfileStyles';
const useStyles = makeStyles(styles);

const UserProfile = () => {
  const classes = useStyles();

  const token = useSelector(state => state.user.accessToken);

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    getUserProfile(token).then(result => {
      setUserInfo(data => ({
        ...data,
        id: result.data.id,
        email: result.data.email,
        first_name: result.data.first_name,
        last_name: result.data.last_name,
        role: result.data.role,
        agency: result.data.agency
      }));
    }).catch((e) => {
    })
  }, [token]);

  const handleSubmit = (values) => {
      updateUserProfile(token, values).then(result => {
        if (result.data.error){
          setUserInfo(data => ({
            ...data,
            message: result.data.message,
            messageType: "error"
          }));
        } else {
          setUserInfo(data => ({
            ...data,
            id: result.data.id,
            email: result.data.email,
            first_name: result.data.first_name,
            last_name: result.data.last_name,
            role: result.data.role,
            agency: result.data.agency,
            password: '',
            old_password: '',
            confirm_password: '',
            message: "Profile updated successfully",
            messageType: "success"
          }));
        }
      });
  }

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <h2 className={classes.title}>User Profile</h2>
          {
            userInfo && userInfo.message ? (
              <Alert
                variant={userInfo.messageType}
                message={userInfo.message}
              />
            ): null
          }
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          {
            userInfo && userInfo ? (
              <ProfileForm userInfo={userInfo} handleSubmit={handleSubmit} />
            ) : null
          }
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default UserProfile;
