import React from 'react';
import { useSelector } from "react-redux";
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import DashboardLayout from 'layouts/Dashboard';
import PublicLayout from 'layouts/Public';

import Home from 'views/Home/Home';
import Editor from 'views/Home/Editor';

import Login from 'views/Login/Login';

import Dashboard from 'views/Dashboard/Dashboard';

import AgencyCreate from 'views/Agency/AgencyCreate';
import AgencyDetails from 'views/Agency/AgencyDetails';
import AgencyEdit from 'views/Agency/AgencyEdit';

import ProgramCreate from 'views/Program/ProgramCreate';
import ProgramDetails from 'views/Program/ProgramDetails';
import ProgramEdit from 'views/Program/ProgramEdit';

import Results from 'views/Search/Results';

import Queue from 'views/Queue/Queue';
import AgencyQueue from 'views/Queue/AgencyQueue';
import ProgramQueue from 'views/Queue/ProgramQueue';

import Users from 'views/UserManagement/UserManagement';
import Settings from 'views/Settings/Settings';

import Profile from 'views/UserProfile/UserProfile';

import NotFound from 'views/NotFound/NotFound';


const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <PublicRoute exact path="/" component={Home} layout={PublicLayout} />

          <PublicRoute path="/login" component={Login} layout={PublicLayout} />

          <PublicRoute path="/editor" component={Editor} layout={PublicLayout} />

          <PublicRoute path="/agency/create" component={AgencyCreate} layout={PublicLayout} />
          <PublicRoute path="/agency/edit/:slug" component={AgencyEdit} layout={PublicLayout} />
          <PublicRoute path="/agency/:slug" component={AgencyDetails} layout={PublicLayout} />
          
          <PublicRoute exact path="/program/create/" component={ProgramCreate} layout={PublicLayout} />
          <PublicRoute path="/program/create/:agencySlug" component={ProgramCreate} layout={PublicLayout} />
          <PublicRoute path="/program/edit/:agency/:slug" component={ProgramEdit} layout={PublicLayout} />
          <PublicRoute path="/program/:agency/:slug" component={ProgramDetails} layout={PublicLayout} />

          <PublicRoute path="/search" component={Results} layout={PublicLayout}/>

          {/* LOGGED USERS */}
          <PrivateRoute exact path="/private" component={Dashboard} layout={DashboardLayout} />
          <PrivateRoute exact path="/private/profile" component={Profile} layout={DashboardLayout} />

          {/* ONLY ADMIN AND AccessHOU Quality Team */}
          <SecureRoute exact path="/private/queue" component={Queue} layout={DashboardLayout} />
          <SecureRoute exact path="/private/queue/agency/:queueId" component={AgencyQueue} layout={DashboardLayout} />
          <SecureRoute exact path="/private/queue/program/:queueId" component={ProgramQueue} layout={DashboardLayout} />

          {/* ONLY ADMIN */}
          <AdminRoute exact path="/private/users" component={Users} layout={DashboardLayout} />
          <AdminRoute exact path="/private/settings" component={Settings} layout={DashboardLayout} />

          <PublicRoute path='*' exact={true} component={NotFound} layout={PublicLayout} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

const PublicRoute = ({ component: Component, layout: Layout, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => (
        <Layout><Component {...props} /></Layout>
      )}
    />
  );
}

const PrivateRoute = ({ component: Component, layout: Layout, ...rest }) => {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  return (
    <Route
      {...rest}
      render={props => (
        isAuthenticated ? <Layout><Component {...props} /></Layout> : <Redirect to={{ pathname: "/" }} />
      )}
    />
  );
}

const AdminRoute = ({ component: Component, layout: Layout, ...rest }) =>{
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const roleId = useSelector(state => state.user.roleId);
  return (
    <Route
      {...rest}
      render={props => (
        isAuthenticated && roleId === 1 ? <Layout><Component {...props} /></Layout> : <Redirect to={{ pathname: "/" }} />
      )}
    />
  );
}

const SecureRoute = ({ component: Component, layout: Layout, ...rest }) =>{
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const roleId = useSelector(state => state.user.roleId);
  const availableRolesId = [1, 2];
  return (
    <Route
      {...rest}
      render={props => (
        (isAuthenticated && availableRolesId.includes(roleId)) ? <Layout><Component {...props} /></Layout> : <Redirect to={{ pathname: "/" }} />
      )}
    />
  );
}

export default App;
