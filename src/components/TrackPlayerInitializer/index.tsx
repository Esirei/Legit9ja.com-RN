import { useEffect } from 'react';
import RNTrackPlayer from 'react-native-track-player';
import { currentTrackSelector, tracksSelector } from '@selectors/audioPlayerSelectors';
import images from '@assets/images';
import { isPlaying } from '@helpers';
import { store } from '../../store';

const TrackPlayerInitializer = () => {
  const setup = async () => {
    await RNTrackPlayer.setupPlayer();
    await RNTrackPlayer.updateOptions({
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
  };

  useEffect(() => {
    const state = store.getState();
    const currentTrack = currentTrackSelector(state);
    const tracks = tracksSelector(state);

    RNTrackPlayer.getState().then(playbackState => {
      const playing = isPlaying(playbackState);

      if (!playing) {
        console.log('AudioPlayer - setting up', tracks);
        setup().then(async () => {
          // return;
          tracks.forEach(track => {
            RNTrackPlayer.add(track).then(() => {
              if (currentTrack && track.id === currentTrack.id) {
                RNTrackPlayer.skip(currentTrack.id);
              }
            });
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
