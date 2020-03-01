import React from 'react';
import { NavLink } from "react-router-dom";
import clsx from 'clsx';

import {
  useSelector,
  useDispatch,
} from 'react-redux';

// Actions
import {
  signOutAction
} from 'actions/user';

import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SettingsIcon from '@material-ui/icons/Settings';
import QueueIcon from '@material-ui/icons/Queue';
import EditIcon from '@material-ui/icons/Edit';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NoteIcon from '@material-ui/icons/Note';
import ReportIcon from '@material-ui/icons/Report';
import SubjectIcon from '@material-ui/icons/Subject';

import HomeIcon from '@material-ui/icons/Home';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { makeStyles } from '@material-ui/core/styles';

import styles from 'layouts/DashboardStyles';

const useStyles = makeStyles(styles);

const CustomNavLink = ({ to, selectedIndex, itemPosition, text, icon: CustomIcon, handleClick}) => {
  const classes = useStyles();

  const handleCustomClick = () => {
    handleClick(itemPosition);
  }

  return (
    <NavLink to={to} className={classes.customLink} onClick={handleCustomClick}>
      <ListItem button
        selected={selectedIndex === itemPosition}>
        <ListItemIcon>
          <CustomIcon />
        </ListItemIcon>
        <ListItemText classes={{
              root: classes.longText
            }} primary={text} />
      </ListItem>
    </NavLink>
  )
}

export default ({ children, menu }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(true);
  const [selectedIndex, setSelectedIndex] = React.useState(menu);

  const loggedUser = useSelector(state => state.user);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSignout = () => {
    dispatch(signOutAction());
  }

  const handleListItemClick = (selectedIndex) => {
    setSelectedIndex(selectedIndex);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            AccessHOU Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <CustomNavLink
            to="/private?menu=1"
            selectedIndex={selectedIndex}
            itemPosition={1}
            text="Dashboard"
            icon={DashboardIcon}
            handleClick={handleListItemClick}
          />
          <NavLink to="/" className={classes.customLink}>
            <ListItem button>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </NavLink>
          <NavLink to="/editor" className={classes.customLink}>
            <ListItem button>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="Editor" />
            </ListItem>
          </NavLink>
          <CustomNavLink
            to="/private/create/advocacy-report?menu=2"
            selectedIndex={selectedIndex}
            itemPosition={2}
            text="Create Advocacy Report"
            icon={ReportIcon}
            handleClick={handleListItemClick}
          />
          {
            loggedUser.approveQueue ? (
              <CustomNavLink
                to="/private/queue?menu=3"
                selectedIndex={selectedIndex}
                itemPosition={3}
                text="Queue"
                icon={QueueIcon}
                handleClick={handleListItemClick}
              />
            ) : null
          }
          {
            loggedUser.roleId === 1 ? (
              <React.Fragment>
                <CustomNavLink
                  to="/private/users?menu=4"
                  selectedIndex={selectedIndex}
                  itemPosition={4}
                  text="Users"
                  icon={PeopleIcon}
                  handleClick={handleListItemClick}
                />
                <CustomNavLink
                  to="/private/settings?menu=5"
                  selectedIndex={selectedIndex}
                  itemPosition={5}
                  text="Settings"
                  icon={SettingsIcon}
                  handleClick={handleListItemClick}
                />
              </React.Fragment>
            ) : null
          }
          {
            loggedUser.viewAdvocacyReport ? (
              <CustomNavLink
                to="/private/advocacy-reports?menu=6"
                selectedIndex={selectedIndex}
                itemPosition={6}
                text="Advocacy Reports"
                icon={SubjectIcon}
                handleClick={handleListItemClick}
              />
            ) : null
          }
          <CustomNavLink
            to="/private/profile?menu=7"
            selectedIndex={selectedIndex}
            itemPosition={7}
            text="Profile"
            icon={AccountBoxIcon}
            handleClick={handleListItemClick}
          />
          <CustomNavLink
            to="/private/user-manual?menu=8"
            selectedIndex={selectedIndex}
            itemPosition={8}
            text="Registered User Manual"
            icon={NoteIcon}
            handleClick={handleListItemClick}
          />
          <ListItem button onClick={handleSignout}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Sign out" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {children}
        </Container>
      </main>
    </div>
  );
}
