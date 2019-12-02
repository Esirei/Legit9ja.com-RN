import { createStore, applyMiddleware, compose } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-community/async-storage';
import appReducer from '@reducers';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, appReducer);

// https://github.com/zalmoxisus/redux-devtools-extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// Add middlewares to array
const middlewares = [thunk];

if (__DEV__) {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

const enhancers = [applyMiddleware(...middlewares)];

export const store = createStore(persistedReducer, composeEnhancers(...enhancers));

export const persistor = persistStore(store);

// TODO Properly migrate state structure on change
persistor.purge().then(r => console.log('Persisted state purged...', r));
