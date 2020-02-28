import { State } from 'react-native-track-player';

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
