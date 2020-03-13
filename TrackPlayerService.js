import RNTrackPlayer, { State, Event } from 'react-native-track-player';
import { Platform } from 'react-native';
import { store } from './src/store';
import { currentTrackID, playbackState } from '@actions/audioPlayerActions';
import { stateName } from '@helpers/player';

export default async function() {
  RNTrackPlayer.addEventListener(Event.RemotePlay, () => {
    RNTrackPlayer.play();
  });

  RNTrackPlayer.addEventListener(Event.RemotePause, () => {
    RNTrackPlayer.pause();
  });

  RNTrackPlayer.addEventListener(Event.RemoteStop, () => {
    RNTrackPlayer.stop();
  });

  RNTrackPlayer.addEventListener(Event.RemoteNext, () => {
    RNTrackPlayer.skipToNext();
  });

  RNTrackPlayer.addEventListener(Event.RemotePrevious, () => {
    RNTrackPlayer.skipToPrevious();
  });

  RNTrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => {
    RNTrackPlayer.seekTo(position);
  });

  RNTrackPlayer.addEventListener(Event.RemoteJumpForward, async ({ interval }) => {
    const duration = await RNTrackPlayer.getDuration();
    const position = await RNTrackPlayer.getPosition();
    const newPosition = position + interval;
    if (newPosition < duration) {
      await RNTrackPlayer.seekTo(newPosition);
    }
  });

  RNTrackPlayer.addEventListener(Event.RemoteJumpBackward, async ({ interval }) => {
    const position = await RNTrackPlayer.getPosition();
    const newPosition = position - interval;
    if (newPosition > 0) {
      await RNTrackPlayer.seekTo(newPosition);
    }
  });

  RNTrackPlayer.addEventListener(Event.PlaybackState, async event => {
    console.log('playback-state', stateName(event.state), event);
    store.dispatch(playbackState(event.state));
  });

  RNTrackPlayer.addEventListener(Event.PlaybackTrackChanged, async event => {
    const { nextTrack } = event;
    console.log('playback-track-changed', event);
    !!nextTrack && store.dispatch(currentTrackID(nextTrack));
  });

  RNTrackPlayer.addEventListener(Event.PlaybackQueueEnded, async event => {
    console.log('playback-queue-ended', event);
  });

  if (Platform.OS === 'android') {
    RNTrackPlayer.addEventListener(Event.RemoteSkip, async ({ id }) => {
      await RNTrackPlayer.skip(id);
    });

    RNTrackPlayer.addEventListener(Event.RemotePlayId, async ({ id }) => {
      await RNTrackPlayer.skip(id);
    });

    // For now it's only available on android in v2
    RNTrackPlayer.addEventListener('playback-metadata-received', async meta => {
      const trackId = await RNTrackPlayer.getCurrentTrack();
      console.log('playback-metadata-received', trackId, meta);
      // await RNTrackPlayer.updateMetadataForTrack(trackId, meta);
    });

    let playingBeforeDuck;
    let volumeBeforeDuck;
    const DUCKED_VOLUME = 0.2;
    RNTrackPlayer.addEventListener(Event.RemoteDuck, async ({ paused, permanent, ducking }) => {
      console.log('remote-duck', { paused, permanent, ducking });
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
