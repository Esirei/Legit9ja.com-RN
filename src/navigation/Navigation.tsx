import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import RouteNames from './RouteNames';
import InitialScreenSwitcher from '@components/InitialScreenSwitcher';
import ExtraScreen from '@screens/ExtraScreen';
import ReactNativeScreen from '@screens/ReactNativeScreen';
import HomeScreen from '@screens/home';
import CategoriesScreen from '@screens/categories';
import CategoryPostsScreen from '@screens/categories/CategoryPostsScreen';
import PostScreen from '@screens/post';
import SearchScreen from '@screens/search';
import BookmarksScreen from '@screens/bookmarks';
import Drawer from '@components/Drawer';
import fonts from '@assets/fonts';

// createAppContainer(
//   createSwitchNavigator({
//     InitialScreenSwitcher,
//     BottomTabs: createBottomTabNavigator({
//       [RouteNames.HOME]: ReactNativeScreen,
//       [RouteNames.EXTRA]: ExtraScreen,
//     }),
//   }),
// );

const StackNav = createStackNavigator(
  {
    [RouteNames.HOME]: HomeScreen,
    [RouteNames.CATEGORIES]: CategoriesScreen,
    [RouteNames.CATEGORY_POSTS]: CategoryPostsScreen,
    [RouteNames.POSTS]: PostScreen,
    [RouteNames.SEARCH]: SearchScreen,
    [RouteNames.BOOKMARKS]: BookmarksScreen,
  },
  {
    defaultNavigationOptions: {
      headerTitleStyle: {
        fontFamily: fonts.neo_sans_pro_medium,
        fontSize: 16,
      },
    },
  },
);

const DrawerNav = createDrawerNavigator(
  { StackNav },
  {
    contentComponent: Drawer,
  },
);

export default createAppContainer(DrawerNav);
