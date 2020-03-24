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

export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
