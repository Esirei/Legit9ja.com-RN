import { State, Track } from 'react-native-track-player';
import { types } from '@actions/audioPlayerActions';

export interface TrackFile extends Track {
  id: string;
  url: string;
  title: string;
  artist: string;
  artwork: string;
  duration: number;
  date?: string;
  added: number;
  size: number;
}

export enum Repeat {
  OFF = 'off',
  CURRENT = 'current',
  ALL = 'all',
}

export enum Sort {
  TITLE = 'title',
  ARTIST = 'artist',
  ADDED = 'added',
}

type TracksState = Record<string, TrackFile>;

interface PlayerState {
  tracks: TracksState;
  currentTrackId: string;
  playbackState: State;
  repeat: Repeat;
  shuffle: boolean;
  sort: Sort;
  parentDir: string;
}

const initialState: PlayerState = {
  tracks: {},
  currentTrackId: '',
  playbackState: State.None,
  repeat: Repeat.OFF,
  sort: Sort.TITLE,
  shuffle: false,
  parentDir: '',
};

const tracksReducer = (state = {}, action): TracksState => {
  switch (action.type) {
    case types.AUDIO_PLAYER_ADD_TRACK:
      const { id } = action.payload;
      return { ...state, [id]: action.payload };
    case types.AUDIO_PLAYER_REMOVE_TRACK:
      delete state[action.payload];
      return { ...state };
    case types.AUDIO_PLAYER_UPDATE_TRACKS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default (state = initialState, action): PlayerState => {
  switch (action.type) {
    case types.AUDIO_PLAYER_ADD_TRACK:
    case types.AUDIO_PLAYER_REMOVE_TRACK:
    case types.AUDIO_PLAYER_UPDATE_TRACKS:
      return { ...state, tracks: tracksReducer(state.tracks, action) };
    case types.AUDIO_PLAYER_CURRENT_TRACK_ID:
      return { ...state, currentTrackId: action.payload };
    case types.AUDIO_PLAYER_PLAYBACK_STATE:
      return { ...state, playbackState: action.payload };
    case types.AUDIO_PLAYER_UPDATE_PARENT_DIR:
      return { ...state, parentDir: action.payload };
    default:
      return state;
  }
};
