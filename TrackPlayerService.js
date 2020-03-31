import RNTrackPlayer, { Event, State } from 'react-native-track-player';
import { Platform } from 'react-native';
import { store } from './src/store';
import { currentTrackID, playbackState } from '@actions/audioPlayerActions';
import {
  currentTrackIdSelector,
  currentTrackSelector,
  repeatSelector,
} from '@selectors/audioPlayerSelectors';
import { Repeat } from '@reducers/audioPlayerReducer';
import { stateName } from '@helpers/player';

const isAndroid = Platform.OS === 'android';

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
    console.log('playback-track-changed', event);
    let { nextTrack, position } = event;
    nextTrack = await RNTrackPlayer.getCurrentTrack(); // iOS seems to have an issue returning correct nextTrack, track and position in event.
    const repeat = repeatSelector(store.getState());
    // if (!repeat) {
    if (repeat === Repeat.CURRENT) {
      const currentTrack = currentTrackSelector(store.getState());
      // Different libraries used to get meta. android's duration is in millis while iOS's is in secs
      const duration = Number(currentTrack.duration / (isAndroid ? 1000 : 1));
      const shouldRepeat = position >= duration - 2; // Just some buffer in case duration is higher than final position.
      const e = { position, duration, shouldRepeat };
      console.log('playback-track-changed - repeatCheck', e, currentTrack);
      if (shouldRepeat) {
        const currentTrackId = currentTrackIdSelector(store.getState());
        console.log('playback-track-changed - repeatCurrent', currentTrackId);
        await RNTrackPlayer.skip(currentTrackId);
        return;
      }
    }
    !!nextTrack && store.dispatch(currentTrackID(nextTrack));
  });

  RNTrackPlayer.addEventListener(Event.PlaybackQueueEnded, async event => {
    console.log('playback-queue-ended', event);

    // Start of iOS hack. iOS has issue where playback-track-changed event is not called on last track start.
    let { track, position } = event;
    store.dispatch(currentTrackID(track));
    const shouldRepeat = position !== 0;
    // End of iOS hack.

    const repeat = repeatSelector(store.getState());
    if (repeat === Repeat.ALL && shouldRepeat) {
      console.log('playback-queue-ended - repeatAll');
      const queue = await RNTrackPlayer.getQueue();
      if (queue.length > 0) {
        const currentTrack = queue[0];
        await RNTrackPlayer.skip(currentTrack.id);
        await RNTrackPlayer.play();
      }
    }
  });

  if (isAndroid) {
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
