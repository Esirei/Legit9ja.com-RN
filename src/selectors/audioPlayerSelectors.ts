import RNFetchBlob from 'rn-fetch-blob';
import { createSelector } from 'reselect';
import { TrackFile } from '@reducers/audioPlayerReducer';
import { isPlaying } from '@helpers';
import { AppState } from '@types';

const { fs } = RNFetchBlob;
const f = 'file://';

const getTrack = (id, tracks): TrackFile | undefined => tracks[id];
const mapTrack = (track: TrackFile): TrackFile => ({
  ...track,
  artwork: `${f}${fs.dirs.DocumentDir}${track.artwork}`,
  url: track.url,
});
const sortByTitle = (a: TrackFile, b: TrackFile) => a.title.localeCompare(b.title);
const sortByArtist = (a: TrackFile, b: TrackFile) => a.artist.localeCompare(b.artist);
const sortByAdded = (a: TrackFile, b: TrackFile) => `${a.added}`.localeCompare(`${b.added}`);

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

export const parentDirSelector = state => playerStateSelector(state).parentDir;
export const repeatSelector = state => playerStateSelector(state).repeat;
export const sortSelector = state => playerStateSelector(state).sort;
export const shuffleSelector = state => playerStateSelector(state).shuffle;
