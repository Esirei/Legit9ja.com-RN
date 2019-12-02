import { createSelector } from 'reselect';
import { SessionState } from '@reducers/sessionReducer';
import { AppState } from '@types';

const sessionSelector = (state: AppState): SessionState => state.session;

export const userSelector = createSelector(
  sessionSelector,
  session => session.user,
);

export const tokenSelector = createSelector(
  sessionSelector,
  session => session.token,
);
