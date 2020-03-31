import { useEffect } from 'react';
import RNTrackPlayer, { Capability } from 'react-native-track-player';
import {
  currentTrackSelector,
  shuffleSelector,
  tracksSelector,
} from '@selectors/audioPlayerSelectors';
import images from '@assets/images';
import { isPlaying, shuffleArray } from '@helpers';
import { store } from '../../store';
import { fixTrackFiles, fixSongsParentDir } from '@actions/audioPlayerActions';

const TrackPlayerInitializer = () => {
  const setup = async () => {
    await RNTrackPlayer.setupPlayer();
    await RNTrackPlayer.updateOptions({
      icon: images['music-white'],
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
        Capability.SeekTo,
        Capability.Skip,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.JumpForward,
        Capability.JumpBackward,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      jumpInterval: 15,
    });
  };

  useEffect(() => {
    const state = store.getState();
    const currentTrack = currentTrackSelector(state);

    RNTrackPlayer.getState().then(playbackState => {
      const playing = isPlaying(playbackState);

      if (!playing) {
        console.log('AudioPlayer - setting up');
        setup().then(async () => {
          // return;
          await store.dispatch(fixSongsParentDir());
          await store.dispatch(fixTrackFiles());
          let tracks = tracksSelector(store.getState());
          const shuffled = shuffleSelector(state);
          if (shuffled) {
            tracks = shuffleArray(tracks);
          }
          console.log('AudioPlayer - adding tracks', tracks);
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
