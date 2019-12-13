import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import RouteNames from './RouteNames';
import InitialScreenSwitcher from '@components/InitialScreenSwitcher';
import ExtraScreen from '@screens/ExtraScreen';
import ReactNativeScreen from '@screens/ReactNativeScreen';
import HomeScreen from '@screens/home';
import CategoriesScreen, { CategoryPostsScreen } from '@screens/categories';
import PostScreen from '@screens/post';
import SearchScreen from '@screens/search';
import BookmarksScreen from '@screens/bookmarks';
import Drawer from '@components/Drawer';

// createAppContainer(
//   createSwitchNavigator({
//     InitialScreenSwitcher,
//     BottomTabs: createBottomTabNavigator({
//       [RouteNames.HOME]: ReactNativeScreen,
//       [RouteNames.EXTRA]: ExtraScreen,
//     }),
//   }),
// );

const StackNav = createStackNavigator({
  [RouteNames.HOME]: HomeScreen,
  [RouteNames.CATEGORIES]: CategoriesScreen,
  [RouteNames.CATEGORY_POSTS]: CategoryPostsScreen,
  [RouteNames.POSTS]: PostScreen,
  [RouteNames.SEARCH]: SearchScreen,
  [RouteNames.BOOKMARKS]: BookmarksScreen,
});

const DrawerNav = createDrawerNavigator(
  { StackNav },
  {
    contentComponent: Drawer,
  },
);

export default createAppContainer(DrawerNav);
