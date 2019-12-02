import { useEffect } from 'react';
import { RouteNames, NavigationService } from '@navigation';
import { userSelector } from '@selectors/sessionSelector';
import { store } from '../store';

export const useAuthNavigation = () => {
  // effect only runs once after 1st render
  useEffect(() => {
    // modify as you like
    let oldUser = null; // user before store was updated, change this to have the same structure with initial user object or whatever you want to use to verify user authentication
    const userHandler = () => {
      console.log('User handler running...');
      const user = userSelector(store.getState());
      if (oldUser !== user && user) {
        console.log('user logged in, navigate home', user);
        // should update to: if in auth route(s), navigate to home screen
        const currentRouteName = NavigationService.currentRouteName();
        console.log('Navigation currentRoute', currentRouteName);
        NavigationService.navigate(RouteNames.HOME);
      } else if (!!oldUser && !user) {
        console.log('user logged out, navigate to login');
      }
      // @ts-ignore
      oldUser = user;
      console.log('User handler ends...');
    };
    const storeUnsubscribe = store.subscribe(userHandler);
    console.log('Store subscribed');
    return () => {
      storeUnsubscribe();
      console.log('Store unsubscribed');
    };
  }, []);
};

export default useAuthNavigation;
