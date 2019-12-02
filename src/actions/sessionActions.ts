import apiClient from '@api';

export const types = {
  SESSION_LOGIN_REQUEST: 'SESSION_LOGIN_REQUEST',
  SESSION_LOGIN_SUCCESS: 'SESSION_LOGIN_SUCCESS',
  SESSION_LOGIN_FAILURE: 'SESSION_LOGIN_FAILURE',
  SESSION_SET_TOKEN: 'SESSION_SET_TOKEN',
  SESSION_SET_TOKENS: 'SESSION_SET_TOKENS',
  SESSION_LOGOUT: 'SESSION_LOGOUT',
};

const loginRequest = () => ({
  type: types.SESSION_LOGIN_REQUEST,
});

const loginSuccess = user => ({
  type: types.SESSION_LOGIN_SUCCESS,
  payload: user,
});

const loginFailure = error => ({
  type: types.SESSION_LOGIN_FAILURE,
  error,
});

const setToken = token => ({
  type: types.SESSION_SET_TOKEN,
  payload: token,
});

export const setTokens = tokens => ({
  type: types.SESSION_SET_TOKENS,
  payload: tokens,
});

export const login = (email, password) => async dispatch => {
  dispatch(loginRequest());
  try {
    const tokenResponse = await apiClient.post('login', { email, password });
    const token = tokenResponse.token;
    console.log(`Token: ${token}`);
    dispatch(setToken(token));
    const userResponse = await apiClient.get('users/4');
    const user = userResponse.data;
    console.log('User', user);
    dispatch(loginSuccess(user));
  } catch (e) {
    dispatch(loginFailure(e));
    console.log('Login error', e);
  }
};

export const logout = () => dispatch => {
  dispatch({ type: types.SESSION_LOGOUT });
};
