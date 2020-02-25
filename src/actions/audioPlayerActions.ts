import RNFetchBlob from 'rn-fetch-blob';
import { TrackFile } from '@reducers/audioPlayerReducer';

const { fs } = RNFetchBlob;

export const types = {
  AUDIO_PLAYER_ADD_TRACK: 'AUDIO_PLAYER_ADD_TRACK',
  AUDIO_PLAYER_REMOVE_TRACK: 'AUDIO_PLAYER_REMOVE_TRACK',
  AUDIO_PLAYER_CURRENT_TRACK_ID: 'AUDIO_PLAYER_CURRENT_TRACK_ID',
  AUDIO_PLAYER_PLAYBACK_STATE: 'AUDIO_PLAYER_PLAYBACK_STATE',
};

export const addTrack = (track: TrackFile) => ({
  type: types.AUDIO_PLAYER_ADD_TRACK,
  payload: track,
});

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

export const deleteTrack = (track: TrackFile) => async dispatch => {
  const path = track.url.replace('file://', '');
  const artworkPath = `${path}.jpg`;
  await fs.unlink(path);
  await fs.unlink(artworkPath);
  dispatch(removeTrack(track.id));
};
