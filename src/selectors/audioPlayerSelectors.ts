import { createSelector } from 'reselect';
import { TrackFile } from '@reducers/audioPlayerReducer';
import { isPlaying } from '@helpers';
import { AppState } from '@types';

const getTrack = (id, tracks): TrackFile | null => tracks[id];
const sortByTitle = (a: TrackFile, b: TrackFile) => a.title.localeCompare(b.title);

const playerStateSelector = (state: AppState) => state.audioPlayer;
const tracksStateSelector = (state: AppState) => playerStateSelector(state).tracks;

export const currentTrackIdSelector = createSelector(
  playerStateSelector,
  state => state.currentTrackId,
);

export const makeTrackSelector = id => {
  return createSelector(
    tracksStateSelector,
    tracks => getTrack(id, tracks),
  );
};

export const currentTrackSelector = createSelector(
  currentTrackIdSelector,
  tracksStateSelector,
  getTrack,
);

export const tracksSelector = createSelector(
  tracksStateSelector,
  tracks => Object.values(tracks).sort(sortByTitle),
);

export const playbackStateSelector = createSelector(
  playerStateSelector,
  state => state.playbackState,
);

export const isPlayingSelector = createSelector(
  playbackStateSelector,
  isPlaying,
);
