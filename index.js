/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import RNTrackPlayer from 'react-native-track-player';
import TrackPlayerService from './TrackPlayerService';

// Disables yellow console warnings in dev app.
console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
RNTrackPlayer.registerPlaybackService(() => TrackPlayerService);
