import RNTrackPlayer, { State } from 'react-native-track-player';
import { Platform } from 'react-native';
import { store } from './src/store';
import { currentTrackID, playbackState } from '@actions/audioPlayerActions';
import { stateName } from '@helpers/player';

export default async function() {
  RNTrackPlayer.addEventListener('remote-play', () => {
    RNTrackPlayer.play();
  });

  RNTrackPlayer.addEventListener('remote-pause', () => {
    RNTrackPlayer.pause();
  });

  RNTrackPlayer.addEventListener('remote-next', () => {
    RNTrackPlayer.skipToNext();
  });

  RNTrackPlayer.addEventListener('remote-previous', () => {
    RNTrackPlayer.skipToPrevious();
  });

  RNTrackPlayer.addEventListener('remote-jump-forward', async ({ interval }) => {
    const duration = await RNTrackPlayer.getDuration();
    const position = await RNTrackPlayer.getPosition();
    const newPosition = position + interval;
    if (newPosition < duration) {
      await RNTrackPlayer.seekTo(newPosition);
    }
  });

  RNTrackPlayer.addEventListener('remote-jump-backward', async ({ interval }) => {
    const position = await RNTrackPlayer.getPosition();
    const newPosition = position - interval;
    if (newPosition > 0) {
      await RNTrackPlayer.seekTo(newPosition);
    }
  });

  RNTrackPlayer.addEventListener('remote-stop', () => {
    RNTrackPlayer.stop();
  });

  RNTrackPlayer.addEventListener('playback-metadata-received', async meta => {
    const trackId = await RNTrackPlayer.getCurrentTrack();
    console.log('playback-metadata-received', trackId, meta);
    // await RNTrackPlayer.updateMetadataForTrack(trackId, meta);
  });

  RNTrackPlayer.addEventListener('playback-state', async event => {
    console.log('playback-state', stateName(event.state));
    store.dispatch(playbackState(event.state));
  });

  RNTrackPlayer.addEventListener('playback-track-changed', async event => {
    const { nextTrack } = event;
    console.log('playback-track-changed', event);
    !!nextTrack && store.dispatch(currentTrackID(nextTrack));
  });

  RNTrackPlayer.addEventListener('playback-queue-ended', async event => {
    console.log('playback-queue-ended', event);
  });

  if (Platform.OS === 'android') {
    RNTrackPlayer.addEventListener('remote-skip', async ({ id }) => {
      await RNTrackPlayer.skip(id);
    });

    RNTrackPlayer.addEventListener('remote-play-id', async ({ id }) => {
      await RNTrackPlayer.skip(id);
    });

    let playingBeforeDuck;
    let volumeBeforeDuck;
    const DUCKED_VOLUME = 0.2;
    RNTrackPlayer.addEventListener('remote-duck', async ({ paused, permanent, ducking }) => {
      console.log('remote-ducking', { paused, permanent, ducking });
      if (permanent) {
        await RNTrackPlayer.stop();
        return;
      }

      if (paused) {
        const playerState = await RNTrackPlayer.getState();
        playingBeforeDuck = playerState === State.Playing;
        await RNTrackPlayer.pause();
        return;
      }

      if (ducking) {
        const volume = await RNTrackPlayer.getVolume();
        if (volume > DUCKED_VOLUME) {
          volumeBeforeDuck = volume;
          await RNTrackPlayer.setVolume(DUCKED_VOLUME);
        }
        return;
      }

      if (playingBeforeDuck) {
        await RNTrackPlayer.play();
      }

      const playerVolume = await RNTrackPlayer.getVolume();
      if (volumeBeforeDuck > playerVolume) {
        await RNTrackPlayer.setVolume(volumeBeforeDuck || 1);
      }

      volumeBeforeDuck = playingBeforeDuck = null;
    });
  }
}
