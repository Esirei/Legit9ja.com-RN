import React, { useEffect } from 'react';
import { View } from 'react-native';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import SplashScreen from 'react-native-splash-screen';
import { store, persistor } from './store';
import Navigation from '@navigation/Navigation';
import { NavigationService } from '@navigation';
import useAuthNavigation from '@hooks/useAuthNavigation';
import ApiInterceptors from '@components/ApiInterceptors';

const App = () => {
  const setNavigator = ref => NavigationService.setRef(ref);
  useAuthNavigation();
  useEffect(() => SplashScreen.hide(), []);
  return (
    <Provider store={store}>
      <ApiInterceptors />
      <PersistGate loading={<View />} persistor={persistor}>
        <Navigation ref={setNavigator} />
      </PersistGate>
    </Provider>
  );
};

export default App;
