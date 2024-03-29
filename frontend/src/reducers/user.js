import {
  FAILURE,
  LOGIN,
  LOGOUT
 } from 'actions/user';

const initialState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  email: null,
  name: null,
  isAdmin: null,
  roleId: null,
  role: null,
  approveQueue: null,
  skipQueue: null,
  hilscVerified: null,
  advocacyReport: null,
  viewAdvocacyReport: null,
  error: false,
};

export default (state = initialState, action) => {
  switch(action.type) {
    case FAILURE:
      return {
        ...state,
        error: true
      }
    case LOGIN:
      return {
        ...state,
        isAuthenticated: action.data.access_token ? true : false,
        accessToken: action.data.access_token,
        refreshToken: action.data.refresh_token,
        email: action.data.email,
        name: action.data.name,
        isAdmin: action.data.is_admin,
        roleId: action.data.role.id,
        role: action.data.role.name,
        approveQueue: action.data.role.approve_queue,
        skipQueue: action.data.role.skip_queue,
        hilscVerified: action.data.role.hilsc_verified,
        advocacyReport: action.data.role.advocacy_reports,
        viewAdvocacyReport: action.data.role.view_advocacy_reports,
        error: false,
      };
    case LOGOUT:
      return {
        ...initialState,
      }
    default:
      return state;
  }
}
