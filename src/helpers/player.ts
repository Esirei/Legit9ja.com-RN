import RNTrackPlayer, { STATE_PLAYING, STATE_BUFFERING } from 'react-native-track-player';

export const isPlaying = state => state === STATE_PLAYING || state === STATE_BUFFERING;

export const stateName = state => {
  switch (state) {
    case RNTrackPlayer.STATE_NONE:
      return 'None';
    case RNTrackPlayer.STATE_READY:
      return 'Ready';
    case RNTrackPlayer.STATE_BUFFERING:
      return 'Buffering';
    case RNTrackPlayer.STATE_PLAYING:
      return 'Playing';
    case RNTrackPlayer.STATE_PAUSED:
      return 'Paused';
    case RNTrackPlayer.STATE_STOPPED:
      return 'Stopped';
  }
};
