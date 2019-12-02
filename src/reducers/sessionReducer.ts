import { types } from '@actions/sessionActions';

export interface SessionState {
  user: Record<string, any> | null;
  token: string | null;
  refreshToken: string | null;
}

const initialState: SessionState = {
  user: null,
  token: null,
  refreshToken: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SESSION_LOGIN_REQUEST:
      return { ...state };
    case types.SESSION_LOGIN_SUCCESS:
      return { ...state, user: action.payload };
    case types.SESSION_LOGIN_FAILURE:
      return initialState;
    case types.SESSION_SET_TOKEN:
      return { ...state, token: action.payload };
    case types.SESSION_SET_TOKENS:
      const { access_token, refresh_token } = action.payload;
      return { ...state, token: access_token, refreshToken: refresh_token };
    case types.SESSION_LOGOUT:
      return initialState;
    default:
      return state;
  }
};
