import { createSelector, Selector } from 'reselect';
import { RequestState } from '@reducers/requestStatusReducer';

export type RequestStatus = [boolean, any];

export const requestStatusSelector = (state: RequestState): RequestStatus => [
  state.inRequest || false,
  state.error || null,
];

export const makeRequestStatusSelector = <S>(stateSelector: Selector<S, RequestState>) => {
  return createSelector<any, RequestState, RequestStatus>(
    stateSelector,
    requestStatusSelector,
  );
};

export default makeRequestStatusSelector;
