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
import AgencyEditQueue from 'views/Queue/AgencyEditQueue';
import ProgramQueue from 'views/Queue/ProgramQueue';
import ProgramEditQueue from 'views/Queue/ProgramEditQueue';

import PublicLogs from 'views/PublicLogs/PublicLogs';

import Users from 'views/UserManagement/UserManagement';
import Settings from 'views/Settings/Settings';

import Profile from 'views/UserProfile/UserProfile';
import UserManualPublic from 'views/UserManual/UserManualPublic';
import UserManualPrivate from 'views/UserManual/UserManualPrivate';

import CreateAdvocacyReport from 'views/AdvocacyReport/AdvocacyReportCreate';
import AdvocacyReports from 'views/AdvocacyReport/AdvocacyReports';

import PartnersMap from 'views/PartnersMap/PartnersMap';
import AgenciesVerify from 'views/AgenciesVerify/AgenciesVerify';

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

          <PublicRoute path="/agencies/map" component={PartnersMap} layout={PublicLayout}/>
          <PublicRoute path="/agencies/verify" component={AgenciesVerify} layout={PublicLayout}/>


          <PublicRoute exact path="/program/create/" component={ProgramCreate} layout={PublicLayout} />
          <PublicRoute path="/program/create/:agencySlug" component={ProgramCreate} layout={PublicLayout} />
          <PublicRoute path="/program/edit/:agency/:slug" component={ProgramEdit} layout={PublicLayout} />
          <PublicRoute path="/program/:agency/:slug" component={ProgramDetails} layout={PublicLayout} />

          <PublicRoute path="/user-manual" component={UserManualPublic} layout={PublicLayout}/>

          {/* Logged Users */}
          <PrivateRoute exact path="/private" component={Dashboard} layout={DashboardLayout} menu={1} />
          <PrivateRoute exact path="/private/profile" component={Profile} layout={DashboardLayout} menu={7} />

          {/* Only admin and AccessHOU Quality Team */}
          <SecureRoute exact path="/private/queue" component={Queue} layout={DashboardLayout} menu={3} />
          <SecureRoute exact path="/private/queue/agency/:queueId" component={AgencyQueue} layout={DashboardLayout} menu={3} />
          <SecureRoute exact path="/private/queue/agency/edit/:queueId" component={AgencyEditQueue} layout={DashboardLayout} menu={3} />
          <SecureRoute exact path="/private/queue/program/:queueId" component={ProgramQueue} layout={DashboardLayout} menu={3} />
          <SecureRoute exact path="/private/queue/program/edit/:queueId" component={ProgramEditQueue} layout={DashboardLayout} menu={3} />

          <SecureRoute exact path="/private/changelogs" component={PublicLogs} layout={DashboardLayout} menu={9} />

          <AdvocacyCreateRoute exact path="/private/create/advocacy-report" component={CreateAdvocacyReport} layout={DashboardLayout} menu={2} />
          <AdvocacyReportViewRoute exact path="/private/advocacy-reports" component={AdvocacyReports} layout={DashboardLayout} menu={6} />

          {/* Only Admin */}
          <AdminRoute exact path="/private/users" component={Users} layout={DashboardLayout} menu={4} />
          <AdminRoute exact path="/private/settings" component={Settings} layout={DashboardLayout} menu={5} />

          {/* Logged user manual */}
          <PrivateRoute exact path="/private/user-manual" component={UserManualPrivate} layout={DashboardLayout} menu={8} />

          {/* Search */}
          <Route render={props => ( <Results {...props} />)} />

          <PublicRoute path='*' exact={true} component={NotFound} layout={PublicLayout} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

const PublicRoute = ({ component: Component, layout: Layout, menu, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => (
        <Layout><Component {...props} /></Layout>
      )}
    />
  );
}

const PrivateRoute = ({ component: Component, layout: Layout, menu, ...rest }) => {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  return (
    <Route
      {...rest}
      render={props => (
        isAuthenticated ? <Layout menu={menu}><Component {...props} /></Layout> : <Redirect to={{ pathname: "/login" }} />
      )}
    />
  );
}

const AdminRoute = ({ component: Component, layout: Layout, menu, ...rest }) =>{
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const user = useSelector(state => state.user);
  return (
    <Route
      {...rest}
      render={props => (
        isAuthenticated && user.role === 'Admin' ? <Layout menu={menu}><Component {...props} /></Layout> : <Redirect to={{ pathname: "/" }} />
      )}
    />
  );
}

const SecureRoute = ({ component: Component, layout: Layout, menu, ...rest }) =>{
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const user = useSelector(state => state.user);
  return (
    <Route
      {...rest}
      render={props => (
        (isAuthenticated && user.approveQueue) ? <Layout menu={menu}><Component {...props} /></Layout> : <Redirect to={{ pathname: "/" }} />
      )}
    />
  );
}

const AdvocacyCreateRoute = ({ component: Component, layout: Layout, menu, ...rest }) =>{
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const user = useSelector(state => state.user);
  return (
    <Route
      {...rest}
      render={props => (
        (isAuthenticated && user.advocacyReport) ? <Layout menu={menu}><Component {...props} /></Layout> : <Redirect to={{ pathname: "/" }} />
      )}
    />
  );
}

const AdvocacyReportViewRoute = ({ component: Component, layout: Layout, menu, ...rest }) =>{
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const user = useSelector(state => state.user);
  return (
    <Route
      {...rest}
      render={props => (
        (isAuthenticated && user.viewAdvocacyReport) ? <Layout menu={menu}><Component {...props} /></Layout> : <Redirect to={{ pathname: "/" }} />
      )}
    />
  );
}


export default App;
