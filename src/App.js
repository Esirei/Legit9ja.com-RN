import React, { useEffect } from 'react';
import { View } from 'react-native';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import SplashScreen from 'react-native-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import codePush from 'react-native-code-push';
import { store, persistor } from './store';
import Navigation from '@navigation/Navigation';
import { NavigationService } from '@navigation';
import useAuthNavigation from '@hooks/useAuthNavigation';
import ApiInterceptors from '@components/ApiInterceptors';
import NotificationService from '@components/NotificationService';
import TrackPlayerInitializer from '@components/TrackPlayerInitializer';

const App = () => {
  const setNavigator = ref => NavigationService.setRef(ref);
  useAuthNavigation();
  useEffect(() => SplashScreen.hide(), []);
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ApiInterceptors />
        <PersistGate loading={<View />} persistor={persistor}>
          <TrackPlayerInitializer />
          <Navigation ref={setNavigator} />
          {/*We don't want this to initialise b4 react-navigation, therefore it's placed here*/}
          <NotificationService />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

const codePushOptions = {
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
};

export default codePush(codePushOptions)(App);
