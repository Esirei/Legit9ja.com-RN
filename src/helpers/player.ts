import RNTrackPlayer, { State } from 'react-native-track-player';

export const isPlaying = state => state === State.Playing || state === State.Buffering;

export const stateName = state => {
  switch (state) {
    case State.None:
      return 'None';
    case State.Ready:
      return 'Ready';
    case State.Buffering:
      return 'Buffering';
    case State.Playing:
      return 'Playing';
    case State.Paused:
      return 'Paused';
    case State.Stopped:
      return 'Stopped';
    case State.Connecting:
      return 'Connecting';
  }
};

export const shuffleArray = (array: any[]) => {
  const updated = [...array];
  for (let i = updated.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [updated[i], updated[j]] = [updated[j], updated[i]];
  }
  return updated;
};

const skipToTrack = async (position: 'first' | 'last') => {
  const queue = await RNTrackPlayer.getQueue();
  if (queue.length > 0) {
    const track = queue[position === 'first' ? 0 : queue.length - 1];
    return RNTrackPlayer.skip(track.id);
  }
};

export const prev = () => {
  RNTrackPlayer.skipToPrevious().catch(async e => {
    await skipToTrack('last');
  });
};

export const next = () => {
  RNTrackPlayer.skipToNext().catch(async e => {
    await skipToTrack('first');
  });
};
