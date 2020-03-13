import { types } from '@actions/toastsActions';

export interface ToastMessage {
  id: number;
  message: string;
  subtitle?: string;
  position: 'top' | 'bottom';
  margin: number;
  type: 'normal' | 'success' | 'error';
  action?: () => void;
  duration?: number;
}

export type ToastState = Record<number, ToastMessage>;

const defaultToast: ToastMessage = {
  position: 'bottom',
  duration: 3000,
  id: 0,
  margin: 0,
  message: '',
  type: 'normal',
};

const toastMessageReducer = (state = defaultToast, action): ToastMessage => {
  switch (action.type) {
    case types.TOAST_ADD:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default (state = {}, action): ToastState => {
  switch (action.type) {
    case types.TOAST_ADD:
      const { id } = action.payload;
      return { ...state, [id]: toastMessageReducer(state[id], action) };
    case types.TOAST_DELETE:
      delete state[action.payload];
      return { ...state };
    default:
      return state;
  }
};
