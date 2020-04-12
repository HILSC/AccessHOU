import React, { useState } from 'react';
import { NavLink } from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from 'react-redux';

// Actions
import {
  signOutAction
} from 'actions/user';

// Materia UI Components
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

// Components
import Logo from 'components/Logo/Logo';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from './PublicHeaderStyles';
const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const [anchorEl, setAnchorEl] = useState(null);
  const [publicAnchorEl, setPublicAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [openPublicMenu, setOpenPublicMenu] = useState(false);

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

  const handlePublicMenu = (event) => {
    setPublicAnchorEl(event.currentTarget);
    setOpenPublicMenu(true);
  }

  const handlePublicClose = () => {
    setPublicAnchorEl(null);
    setOpenPublicMenu(false);
  }

  return (
    <React.Fragment>
      <div className={classes.title}>
        <NavLink to="/" className={classes.customLink}>
          <Logo />
        </NavLink>
      </div>
      {
        isAuthenticated ? (
          <React.Fragment>
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
                <NavLink to="/private" className={classes.customLink} onClick={handleClose}>Dashboard</NavLink>
              </MenuItem>
              <Divider />
              <MenuItem>
                <NavLink to="/user-manual" className={classes.customLink} onClick={handleClose}>User manual</NavLink>
              </MenuItem>
              <MenuItem onClick={handleSignout}>Sign out</MenuItem>
            </Menu>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <NavLink to="/login" className={classes.customLink}>
              <Button variant="contained" color="primary" classes={{
                root: classes.signInButton
              }}>Sign in</Button>
            </NavLink>
            <IconButton
              color="primary"
              onClick={handlePublicMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={publicAnchorEl}
              open={openPublicMenu}
              onClose={handlePublicClose}
              elevation={2}
            >
              <MenuItem>
                <NavLink to="/editor" className={classes.customLink} onClick={handlePublicClose}>Editor</NavLink>
              </MenuItem>
              <Divider />
              <MenuItem>
                <NavLink to="/user-manual" className={classes.customLink} onClick={handlePublicClose}>User manual</NavLink>
              </MenuItem>
            </Menu>
          </React.Fragment>
        )
      }
    </React.Fragment>
  )
}
