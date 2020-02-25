import { useEffect } from 'react';
import RNTrackPlayer from 'react-native-track-player';
import {
  currentTrackSelector,
  isPlayingSelector,
  tracksSelector,
} from '@selectors/audioPlayerSelectors';
import images from '@assets/images';
import { store } from '../../store';

const TrackPlayerInitializer = () => {
  const setup = () => {
    return RNTrackPlayer.setupPlayer().then(() => {
      RNTrackPlayer.updateOptions({
        playIcon: images['play-circle'],
        pauseIcon: images['pause-circle'],
        previousIcon: images['skip-back'],
        nextIcon: images['skip-forward'],
        rewindIcon: images['rewind-left'],
        forwardIcon: images['rewind-right'],
        icon: images.music,
        capabilities: [
          RNTrackPlayer.CAPABILITY_PLAY,
          RNTrackPlayer.CAPABILITY_PAUSE,
          RNTrackPlayer.CAPABILITY_STOP,
          RNTrackPlayer.CAPABILITY_SEEK_TO,
          RNTrackPlayer.CAPABILITY_SKIP,
          RNTrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          RNTrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
          RNTrackPlayer.CAPABILITY_JUMP_FORWARD,
          RNTrackPlayer.CAPABILITY_JUMP_BACKWARD,
        ],
        notificationCapabilities: [
          RNTrackPlayer.CAPABILITY_PLAY,
          RNTrackPlayer.CAPABILITY_PAUSE,
          RNTrackPlayer.CAPABILITY_STOP,
          RNTrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          RNTrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        ],
        compactCapabilities: [
          RNTrackPlayer.CAPABILITY_PLAY,
          RNTrackPlayer.CAPABILITY_PAUSE,
          RNTrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          RNTrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        ],
        jumpInterval: 15,
      });
    });
  };

  useEffect(() => {
    const state = store.getState();
    const isPlaying = isPlayingSelector(state);
    const currentTrack = currentTrackSelector(state);
    const tracks = tracksSelector(state);

    setup().then(() => {
      if (!isPlaying) {
        console.log('AudioPlayer - setting up', tracks);
        RNTrackPlayer.reset().then(() => {
          RNTrackPlayer.add(tracks).then(() => {
            if (currentTrack) {
              return RNTrackPlayer.skip(currentTrack.id);
            }
          });
        });
      } else {
        console.log('AudioPlayer - not setting up');
      }
    });
  }, []);

  return null;
};

export default TrackPlayerInitializer;
