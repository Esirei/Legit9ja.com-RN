import RNTrackPlayer from 'react-native-track-player';
import { TrackFile } from '@reducers/audioPlayerReducer';
import { deleteFile } from '@helpers';

export const types = {
  AUDIO_PLAYER_ADD_TRACK: 'AUDIO_PLAYER_ADD_TRACK',
  AUDIO_PLAYER_REMOVE_TRACK: 'AUDIO_PLAYER_REMOVE_TRACK',
  AUDIO_PLAYER_CURRENT_TRACK_ID: 'AUDIO_PLAYER_CURRENT_TRACK_ID',
  AUDIO_PLAYER_PLAYBACK_STATE: 'AUDIO_PLAYER_PLAYBACK_STATE',
};

export const addTrack = (track: TrackFile) => async dispatch => {
  dispatch({ type: types.AUDIO_PLAYER_ADD_TRACK, payload: track });
  await RNTrackPlayer.add(track);
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

export const deleteTrack = (track: TrackFile) => async dispatch => {
  await RNTrackPlayer.remove(track);
  const path = track.url.replace('file://', '');
  const artworkPath = `${path}.jpg`;
  await deleteFile(path);
  await deleteFile(artworkPath);
  dispatch(removeTrack(track.id));
};
