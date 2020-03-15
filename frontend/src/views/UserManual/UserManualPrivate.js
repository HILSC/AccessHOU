import React from "react";

// Material UI components
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

// IMAGES
import MenuIcon from "../../images/manual/menu-icon.PNG";
import EditUser from "../../images/manual/edit_user.PNG";
import AddUser from "../../images/manual/add_user.PNG";

// Styles
import { makeStyles } from "@material-ui/core/styles";
import styles from "./UserManualPrivateStyle";
const useStyles = makeStyles(styles);

export default () => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <ul className={classes.mainUL}>
            <li>
              <a className={classes.primaryAnchor} href="#intro">
                Introduction
              </a>
            </li>
            <li>
              <a className={classes.primaryAnchor} href="#dashboard">
                Dashboard
              </a>
            </li>
            <li>
              <a className={classes.primaryAnchor} href="#home">
                Home
              </a>
            </li>
            <li>
              <a className={classes.primaryAnchor} href="#editor">
                Editor
              </a>
            </li>
            <li>
              <a className={classes.primaryAnchor} href="#queue">
                Queue
              </a>
            </li>
            <li>
              <a className={classes.primaryAnchor} href="#user_management">
                Users (Management)
              </a>
            </li>
            <ul>
              <li>
                <a className={classes.primaryAnchor} href="#add_user">
                  Add User
                </a>
              </li>
              <li>
                <a className={classes.primaryAnchor} href="#edit_user">
                  Edit User
                </a>
              </li>
              <li>
                <a className={classes.primaryAnchor} href="#deactivate_user">
                  Deactivate User
                </a>
              </li>
            </ul>
            <li>
              <a className={classes.primaryAnchor} href="#settings">
                Settings
              </a>
            </li>
            <ul>
              <li>
                <a className={classes.primaryAnchor} href="#emergency_mode">
                  Emergency Mode
                </a>
              </li>
            </ul>
            <li>
              <a className={classes.primaryAnchor} href="#profile">
                Profile
              </a>
            </li>
          </ul>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <h2 id="intro">Introduction</h2>
          <p>
            The AccessHOU Management console allows registered users to control
            behind the scenes functions of AccessHOU. If you would like to add a
            registered user, please contact accesshou@houstonimmigration.org.
          </p>
          <p>
            To get to the Dashboard from AccessHOU, sign in to accesshou.org and
            click this icon in the upper right corner:
          </p>
          <img src={MenuIcon} alt="menu-icon" />
          <p>
            Choose ‘Dashboard’ from the menu. This will take you to the
            Dashboard homepage, which displays the status of the queue and
            offers a menu on the left side of the page. Access to menu items
            depends on your Role in the AccessHOU system:
          </p>
          <table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Permissions</th>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td>Admin</td>
              <td>
                <ul className={classes.circlesUL}>
                  <li>Access to entire dashboard.</li>
                  <li>Edits to agencies/programs skip the queue and go live immediately and marked HILSC verify</li>
                  <li>Records approved by this role will have access to the HILSC verified’ checkbox.</li>
                  <li>Can add advocacy reports.</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>AccessHOU Quality Team</td>
              <td>
                <ul className={classes.circlesUL}>
                  <li>Access to queue -- can approve database edits.</li>
                  <li>Edits to agencies/programs skip the queue and go live immediately and marked HILSC verify</li>
                  <li>Records approved by this role will have access to the HILSC verified checkbox.</li>
                  <li>Can add advocacy reports.</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>AccessHOU Partner</td>
              <td>
                <ul className={classes.circlesUL}>
                  <li>Edits to agencies/programs skip the queue and go live immediately and are NOT marked HILSC verify.</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>Access to Services Workgroup Member</td>
              <td>
                <ul className={classes.circlesUL}>
                  <li>Can add advocacy reports.</li>
                </ul>
              </td>
            </tr>
            </tbody>
          </table>
          <h2 id="dashboard">Dashboard</h2>
          <p>
            The Dashboard is the home page of the AccessHOU Management console.
            It displays the status of the queue and offers a menu on the left
            side of the page.
          </p>
          <h2 id="home">Home</h2>
          <p>
            Home takes a user to the AccessHOU homepage:{" "}
            <a href="/">accesshou.org</a>.
          </p>
          <h2 id="editor">Editor</h2>
          <p>
            Editor takes a user to the AccessHOU editor page, from which they
            can add a new agency or program or edit an existing agency and its
            programs.
          </p>
          <h2 id="queue">Queue</h2>
          <p>
            When an unregistered user adds a new agency or program, or submits a
            change to an existing agency or program, the edits go to the queue
            for quality approval by an Admin or Quality Team member.
          </p>
          <p>The queue table contains the following information: </p>
          <ul className={classes.circlesUL}>
            <li>
              <strong>Name:</strong> Name of the agency or program that was
              added, deleted or edited.
            </li>
            <li>
              <strong>Action:</strong> The type of request. It can be a new,
              edited, or deleted listing.
            </li>
            <li>
              <strong>Type:</strong> Agency or program.
            </li>
            <li>
              <strong>Requestor Email:</strong> Email of the person that
              submitted the request, so if there are questions about the listing
              the quality team reviewer can follow up.
            </li>
            <li>
              <strong>View:</strong> Takes users to the request details page.
              All fields that contain information will be displayed. If
              information has been added the text will be shown in green; if
              information has been deleted the text “(deleted)” will be shown in
              red, and unchanged information appears in black.
            </li>
          </ul>
          <p>
            At the bottom of the table there’s an arrow to navigate through the
            list of requests. 10 requests are shown per page.
          </p>
          <p>
            Admins and Quality Team members then review the information and
            approve, edit or reject the requested changes. Before accepting
            users should check the ‘HILSC Verified’ box if the listing is a
            trusted source of services for immigrants. If a request is approved,
            the information goes into the database and is made public via
            AccessHOU. If the request is rejected, the changes are dismissed.
          </p>
          <h2 id="user_management">Users (Management)</h2>
          <p>
            Admin can add, edit or delete users, including changing their role
            and permissions. The red icon of a person at the top of the page
            will bring up a box to add new users. The search bar can be used to
            filter the list of users by name, agency or email.
          </p>
          <p>
            A list of all registered users is in a paginated table (10 records
            per page). The table columns are:
          </p>
          <ul className={classes.circlesUL}>
            <li>First Name</li>
            <li>Email</li>
            <li>Agency</li>
            <li>Role in the AccessHOU system</li>
            <li>
              Last Login (A user may be signed in for up to a month before
              having to authenticate on the same device.)
            </li>
            <li>Action Buttons</li>
            <ul>
              <li>Edit</li>
              <li>Deactivate</li>
            </ul>
          </ul>
          <p>
            Navigate the table of users by using the pagination arrows below the
            table’s content.
          </p>
          <h3 id="add_user">Add User</h3>
          <p>Click the icon button:</p>
          <img src={AddUser} alt="add-user" />
          <p>
            An overlay will open requesting the necessary user information.
            Required fields are denoted by an asterisk (*). These are the data
            points collected:
          </p>
          <ul className={classes.circlesUL}>
            <li>
              <strong>Email:</strong> Will serve as the user login.
            </li>
            <li>
              <strong>First Name</strong>
            </li>
            <li>
              <strong>Last Name</strong>
            </li>
            <li>
              <strong>Agency:</strong> User’s place of work.
            </li>
            <li>
              <strong>Role:</strong> Role in the AccessHOU system.
            </li>
            <li>
              <strong>Password:</strong> Assigned password by the admin. Users
              should be encouraged to update their password as soon as they log
              in the first time.
            </li>
            <li>
              <strong>Confirm Password:</strong> Confirmation field for the
              password.
            </li>
          </ul>
          <p>
            Once all the required information has been provided, click ‘Save’ at
            the bottom of the form. A message above the user list will notify
            you that the user was created successfully and will be visible in
            the table. To close the overlay without saving changes, click
            ‘Close’.
          </p>
          <h3 id="edit_user">Edit User</h3>
          <p>
            Locate the user in the table (remember you can filter using the
            search box). In the table’s last column you’ll see the edit user
            button:
          </p>
          <img src={EditUser} alt="edit-user" />
          <p>
            An overlay will open with current information and you can edit the
            necessary fields. Click ‘Save’ at the bottom of the form. A message
            above the user table will notify you that the user was edited
            successfully and the new information will be visible in the table.
            To close the overlay without saving changes, click ‘Close’.
          </p>
          <h3 id="deactivate_user">Deactivate User</h3>
          <p>
            To keep the integrity of the data, users are deactivated instead of
            deleted. The user will no longer be able to log into the site and
            will be logged off automatically if currently logged in.{" "}
          </p>
          <p>
            To reactivate a user, click ‘Activate’ on the table for that user.
          </p>
          <h2 id="settings">Settings</h2>
          <p>Only Admins have permission to view and alter Settings. </p>
          <h3 id="emergency_mode">Emergency Mode</h3>
          <p>
            Emergency Mode is activated during an emergency in the Houston
            region that impacts a large portion of the population, such as
            flooding during Tropical Storm Imelda or Hurricane Harvey.
          </p>
          <p>
            Use the toggle on the Settings page to turn on. A message will
            appear to confirm that it should be turned on. Please add a message
            relevant to that emergency. When switched on, a yellow banner will
            appear at the top of all AccessHOU pages displaying the emergency
            message.
          </p>
          <p>
            When AccessHOU is in Emergency Mode, all agency and program
            additions and edits will be immediately reflected in the database,
            so administrators don’t slow the availability of information. As
            such, there will be no quality control so information on AccessHOU
            may or may not be accurate.{" "}
          </p>
          <p>
            Although the information is made live instantly, a request is still
            sent to the queue for future review and distinguished from other
            items with a yellow background color.
          </p>
          <p>
            Once Emergency Mode is turned off, all records go back to the status
            they were before Emergency Mode was activated. If during Emergency
            Mode, a registered user explicitly accepts a changes submitted, the
            changes will be added to the original record and won’t be lost when
            emergency mode is reverted. Everything else will be held in the
            queue for review from Admin and Quality Team members and removed
            from the live site.
          </p>
          <h2 id="profile">Profile</h2>
          <p>Registered users can update their information, including:</p>
          <ul className={classes.circlesUL}>
            <li>
              <strong>Email:</strong> This will serve as the user login name.
            </li>
            <li>
              <strong>First Name</strong>
            </li>
            <li>
              <strong>Last Name</strong>
            </li>
            <li>
              <strong>Agency:</strong> User’s place of work.
            </li>
            <li>
              <strong>Password:</strong> User can update their password for the
              site.
            </li>
          </ul>
        </Grid>
      </Grid>
    </Container>
  );
};
