import { createSelector } from 'reselect';
import { ToastMessage } from '@reducers/toastsReducer';
import { AppState } from '@types';

const sortByOldest = (a: ToastMessage, b: ToastMessage) => a.id - b.id;
const filterByTime = (toast: ToastMessage) => Date.now() < toast.id + 60000; // only show toasts created in the last 1 min.

const toastsStateSelector = (state: AppState) => state.toasts;

export const currentToastSelector = createSelector(
  toastsStateSelector,
  toasts => {
    return Object.values(toasts)
      .filter(filterByTime)
      .sort(sortByOldest)[0];
  },
);
