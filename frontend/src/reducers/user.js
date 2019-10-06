import {
  FAILURE,
  LOGIN,
  LOGOUT
 } from 'actions/user';

const initialState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
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
        email: action.data.email,
        roleId: action.data.role_id,
        role: action.data.role_name,
        error: false,
        accessToken: action.data.access_token,
        refreshToken: action.data.refresh_token
      };
    case LOGOUT:
      return {
        ...initialState,
      }
    default:
      return state;
  }
}
