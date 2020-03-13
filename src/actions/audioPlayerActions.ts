import RNTrackPlayer from 'react-native-track-player';
import { TrackFile } from '@reducers/audioPlayerReducer';
import { deleteFile, moveFile, removeFilePrefix } from '@helpers';
import { currentTrackIdSelector, tracksSelector } from '@selectors/audioPlayerSelectors';

export const types = {
  AUDIO_PLAYER_ADD_TRACK: 'AUDIO_PLAYER_ADD_TRACK',
  AUDIO_PLAYER_REMOVE_TRACK: 'AUDIO_PLAYER_REMOVE_TRACK',
  AUDIO_PLAYER_CURRENT_TRACK_ID: 'AUDIO_PLAYER_CURRENT_TRACK_ID',
  AUDIO_PLAYER_PLAYBACK_STATE: 'AUDIO_PLAYER_PLAYBACK_STATE',
};

export const addTrack = (track: TrackFile, addToQueue = true) => async dispatch => {
  dispatch({ type: types.AUDIO_PLAYER_ADD_TRACK, payload: track });
  addToQueue && (await RNTrackPlayer.add(track));
};

const removeTrack = trackId => ({
  type: types.AUDIO_PLAYER_REMOVE_TRACK,
  payload: trackId,
});

export const currentTrackID = trackId => ({
  type: types.AUDIO_PLAYER_CURRENT_TRACK_ID,
  payload: trackId,
});

export const playbackState = state => ({
  type: types.AUDIO_PLAYER_PLAYBACK_STATE,
  payload: state,
});

export const deleteTrack = (track: TrackFile) => async (dispatch, getState) => {
  const currentTrackId = currentTrackIdSelector(getState());
  if (currentTrackId !== track.id) {
    // @ts-ignore
    await RNTrackPlayer.remove(track.id);
    const path = track.url.replace('file://', '');
    const artworkPath = `${path}.jpg`;
    await deleteFile(path);
    await deleteFile(artworkPath);
    dispatch(removeTrack(track.id));
  }
};

const badTrackRegex = /%E2%80%93/g;
export const fixTrackFiles = () => async (dispatch, getState) => {
  const filePath = path => decodeURI(removeFilePrefix(path)); // need to decode the path because iOS's track-player required an encoded path, also the file:// prefix
  const replace = (file: string) => file.replace(badTrackRegex, encodeURI('-'));
  const tracks = tracksSelector(getState());
  for (const track of tracks) {
    if (track.url.includes('%E2%80%93')) {
      let url = replace(track.url);
      await moveFile(filePath(track.url), filePath(url));
      let artwork = track.artwork;
      if (artwork.includes('%E2%80%93')) {
        artwork = replace(artwork);
        await moveFile(filePath(track.artwork), filePath(artwork));
      }
      console.log('fixTrackFile', track, { ...track, url, artwork });
      dispatch(addTrack({ ...track, url, artwork }, false));
    }
  }
  console.log('fixTrackFiles completed... ');
};

const stripDocumentsDir = () => {
  const regex = /.*(?=\/songs\/.*)/g;
};
