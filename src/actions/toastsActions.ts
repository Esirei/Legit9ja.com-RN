import { ToastMessage } from '@reducers/toastsReducer';

export const types = {
  TOAST_ADD: 'TOAST_ADD',
  TOAST_DELETE: 'TOAST_DELETE',
};

export const addToast = (toast: Partial<ToastMessage> & { message: string }) => ({
  type: types.TOAST_ADD,
  payload: { ...toast, id: Date.now() },
});

export const deleteToast = id => ({
  type: types.TOAST_DELETE,
  payload: id,
});
