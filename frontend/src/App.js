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
import Users from 'views/UserManagement/UserManagement';
import Settings from 'views/Settings/Settings';

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
          <PublicRoute path="/program/edit/:slug" component={ProgramEdit} layout={PublicLayout} />
          <PublicRoute path="/program/:slug" component={ProgramDetails} layout={PublicLayout} />

          <PublicRoute path="/search" component={Results} layout={PublicLayout}/>

          <PrivateRoute exact path="/private" component={Dashboard} layout={DashboardLayout} />
          <PrivateRoute exact path="/private/queue" component={Queue} layout={DashboardLayout} />

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
  const role = useSelector(state => state.user.role);
  return (
    <Route
      {...rest}
      render={props => (
        isAuthenticated && role === 'Admin' ? <Layout><Component {...props} /></Layout> : <Redirect to={{ pathname: "/" }} />
      )}
    />
  );
}

export default App;
