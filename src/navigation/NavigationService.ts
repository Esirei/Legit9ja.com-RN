import {
  NavigationActions,
  StackActions,
  NavigationContainer,
  NavigationRoute,
  NavigationDispatch,
  NavigationPopActionPayload,
} from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';
import RouteNames from './RouteNames';
import { PostScreenParams } from '@screens/post/types';
import { WebScreenParams } from '@screens/web/types';

let _navigator: NavigationContainer & { dispatch: NavigationDispatch };

function setRef(nav) {
  _navigator = nav;
}

function getRef(): NavigationContainer {
  return _navigator;
}

function navigate(routeName: string, params?, action?) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
      action,
    }),
  );
}

function setParams(params, key) {
  _navigator.dispatch(
    NavigationActions.setParams({
      params,
      key,
    }),
  );
}

function push(routeName, params?, action?) {
  _navigator.dispatch(
    StackActions.push({
      routeName,
      params,
      action,
    }),
  );
}

function pop(options: NavigationPopActionPayload = {}) {
  _navigator.dispatch(StackActions.pop(options));
}

function popToTop() {
  _navigator.dispatch(StackActions.popToTop());
}

function back() {
  _navigator.dispatch(NavigationActions.back());
}

function openDrawer() {
  _navigator.dispatch(DrawerActions.openDrawer());
}

function closeDrawer() {
  _navigator.dispatch(DrawerActions.closeDrawer());
}

function toggleDrawer() {
  _navigator.dispatch(DrawerActions.toggleDrawer());
}

type RouteState = { index: number; routes?: NavigationRoute[]; routeName?: string };

const getCurrentRouteName = (route: RouteState): string => {
  const { index, routes, routeName } = route;
  return routes ? getCurrentRouteName(routes[index]) : routeName || '';
};

const currentRouteName = (): string => {
  return getRef() ? getCurrentRouteName(getRef().state.nav!) : '';
};

const navToPost = (params: PostScreenParams) => push(RouteNames.POSTS, params);
const navToWeb = (params: WebScreenParams, action?) => push(RouteNames.WEB, params, action);

export default {
  setRef,
  getRef,
  navigate,
  setParams,
  push,
  pop,
  popToTop,
  back,
  openDrawer,
  closeDrawer,
  toggleDrawer,
  currentRouteName,
  navToPost,
  navToWeb,
};
