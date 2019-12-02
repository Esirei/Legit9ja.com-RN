import { Action, AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Error } from '@api';
import { AppState } from '@types';

export const request = (name: string) => `${name}_REQUEST`;
export const success = (name: string) => `${name}_SUCCESS`;
export const failure = (name: string) => `${name}_FAILURE`;

interface SuccessAction<T> extends Action<string> {
  payload: T;
}

interface ErrorAction<T = Error> extends Action<string> {
  error: T;
}

interface SuccessActionCreator<T> {
  (payload: T): SuccessAction<T>;
}

interface ErrorActionCreator<T = Error> {
  (error: T): ErrorAction<T>;
}

export const actionRequest = (name: string): (() => Action<string>) => {
  return () => ({
    type: request(name),
  });
};

export const actionSuccess = <T>(name: string): SuccessActionCreator<T> => {
  return payload => ({
    type: success(name),
    payload,
  });
};

export const actionFailure = <T>(name: string): ErrorActionCreator<T> => {
  return error => ({
    type: failure(name),
    error,
  });
};

// Examples
// const userRequest = actionRequest('USER');
// const userSuccess = actionSuccess<number>('USER');
// const userFailure = actionFailure<{message: string}>('USER');

export type RAC = () => Action<string>;
export type FAC<E = Error> = ErrorActionCreator<E>;
export type AsyncThunk<R = any, A extends Action = AnyAction, E = any> = ThunkAction<
  PromiseLike<R>,
  AppState,
  E,
  A
>;
export type AsyncThunkCreator<R = any, T extends AsyncThunk<R> = AsyncThunk<R>> = (
  callback: T,
  request?: RAC,
  error?: FAC,
) => T;

export const asyncThunkAction: AsyncThunkCreator = (callback, start, error) => {
  return async (dispatch, getState, extraArgument) => {
    !!start && dispatch(start());
    try {
      return await callback(dispatch, getState, extraArgument);
    } catch (e) {
      !!error && dispatch(error(e));
      return await Promise.reject(e);
    }
  };
};
