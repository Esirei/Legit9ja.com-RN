import { memo, useEffect } from 'react';
import { Platform, ToastAndroid } from 'react-native';
import { useStore } from 'react-redux';
import axios from 'axios';
import api from '@api';
import { AppState } from '@types';
import { tokenSelector } from '@selectors/sessionSelector';
import { logout, setTokens } from '@actions/sessionActions';

const ApiInterceptors = () => {
  console.log('ApiInterceptors started...');
  const store = useStore<AppState>();

  const interceptors = () => api.interceptors();

  // Response error actions
  useEffect(() => {
    let didTokenRefresh = false;

    const requestToken = config => {
      console.warn('Token refresh...');
      didTokenRefresh = true;
      const refresh_token = store.getState().session.refreshToken || '';
      return api
        .post('refresh-token', { refresh_token })
        .then(response => {
          store.dispatch(setTokens(response));
          return api.request(config).then(value => {
            didTokenRefresh = false;
            return value;
          });
        })
        .catch(e => {
          store.dispatch(logout());
          return Promise.reject(e);
        });
    };

    const id = interceptors().response.use(
      value => value,
      error => {
        if (axios.isCancel(error)) {
          console.log('Request cancelled', error);
          return;
        }
        const { config, data, status } = error.response || {}; // Network error will make response undefined
        let message = data ? data.message || data.error : error.message;
        console.warn(`Api status ${status} error!: ${message}`, data, error.toJSON());
        if (status === 401) {
          if (!didTokenRefresh) {
            return requestToken(config);
          } else {
            store.dispatch(logout());
          }
        }
        didTokenRefresh = false;
        message = status >= 500 ? 'Something went wrong' : message; // Error message is same if status is 500 and above
        // TODO Refactor for iOS too... Probably create a Toast Context later.
        Platform.OS === 'android' && ToastAndroid.show(message, ToastAndroid.SHORT);
        const e = status >= 500 ? undefined : data; // Don't need to show trace errors from server
        return Promise.reject({ ...e, message });
      },
    );

    return () => {
      interceptors().response.eject(id);
    };
  }, [store]);

  // Adds token to request. NOTE: Directly using store as it's stable and component doesn't have be re-rendered to get the latest value.
  useEffect(() => {
    const id = interceptors().request.use(value => {
      const token = tokenSelector(store.getState());
      if (token) {
        console.log(`User token is ${token}`);
        value.headers.Authorization = `Bearer ${token}`;
      }
      return value;
    });

    return () => {
      interceptors().request.eject(id);
      console.log('Api token interceptor ejected!', id);
    };
  }, [store]);

  return null;
};

export default memo(ApiInterceptors);
