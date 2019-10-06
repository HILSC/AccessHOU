import { 
  signIn
 } from '../api';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const FAILURE = 'FAILURE';

const dispatchError = (dispatch, error) => {
  dispatch({
    type: FAILURE,
    error: error,
  });
}

const signInAction = (data) => {
  return async (dispatch) => {
    try {
      const result = await signIn(data);

      // Save tokens in local storage
      window.localStorage.setItem('refresh_token', result.data.refresh_token);

      dispatch({
        type: LOGIN,
        data: result.data,
      });
    } catch (error) {
      dispatchError(dispatch, error);
    }
  }
}

const signOutAction = () => {
  return (dispatch) => {
    window.localStorage.clear();
    dispatch({
      type: LOGOUT,
      data: null,
    });
  }
}

export {
  signInAction,
  signOutAction
}
