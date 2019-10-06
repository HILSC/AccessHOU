import React, {
  useState,
} from 'react';
import { NavLink } from "react-router-dom";

import { 
  useSelector,
  useDispatch,
} from 'react-redux';

// Actions
import {
  signOutAction
} from 'actions/user';

// Materia UI Components
import AppBar from '@material-ui/core/AppBar';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

// Components
import Logo from 'components/Logo/Logo';
import Alert from 'components/Alert/Alert';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './PublicStyles';
const useStyles = makeStyles(styles);

export default ({ children }) =>{
  const classes = useStyles();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  const handleSignout = () => {
    dispatch(signOutAction());
    setOpenMenu(false);
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  }

  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenu(false);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          <div className={classes.title}>
            <NavLink to="/" className={classes.customLink}>
              <Logo />
            </NavLink>
          </div>
          {
            isAuthenticated ? (
              <div>
                <IconButton
                  color="primary"
                  onClick={handleMenu}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleClose}
                  elevation={5}
                >
                  <MenuItem>
                    <NavLink to="/editor" className={classes.customLink} onClick={handleClose}>Editor</NavLink>
                  </MenuItem>
                  <MenuItem>
                    <NavLink to="/private" className={classes.customLink} onClick={handleClose}>Admin</NavLink>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleSignout}>Sign out</MenuItem>
                </Menu>
              </div>
            ) : <NavLink to="/login" className={classes.customLink}>
                  <Button variant="contained" color="primary">Sign in</Button>
                </NavLink>
          }
        </Toolbar>
      </AppBar>
      <main>
        {
          !isAuthenticated ? (
            <Alert 
              variant={"warning"}
              message={"You are not authenticated. Please sign in!"}
              queueMessage={false} /> 
          ) : null
        }
        {children}
      </main>
      <footer className={classes.footer}>
        <Container maxWidth="lg">
          <Typography variant="caption" align="center">
            The NeedHOU Houston Social Services Database is a product of <a rel="noopener noreferrer" href="https://www.houstonimmigration.org/" target="_blank"><abbr title="Houston Immigration Legal Services Collaborative">HILSC</abbr></a>. Only HILSC Verified data has been accounted for by HILSC.
          </Typography>
        </Container>
      </footer>
    </div>
  );
}
