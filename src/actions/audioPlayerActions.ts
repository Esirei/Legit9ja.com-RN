import { batch } from 'react-redux';
import RNTrackPlayer from 'react-native-track-player';
import { TrackFile } from '@reducers/audioPlayerReducer';
import { deleteFile, moveFile, removeFilePrefix, documentDir } from '@helpers';
import { currentTrackIdSelector, tracksSelector, parentDir } from '@selectors/audioPlayerSelectors';

export const types = {
  AUDIO_PLAYER_ADD_TRACK: 'AUDIO_PLAYER_ADD_TRACK',
  AUDIO_PLAYER_REMOVE_TRACK: 'AUDIO_PLAYER_REMOVE_TRACK',
  AUDIO_PLAYER_CURRENT_TRACK_ID: 'AUDIO_PLAYER_CURRENT_TRACK_ID',
  AUDIO_PLAYER_PLAYBACK_STATE: 'AUDIO_PLAYER_PLAYBACK_STATE',
  AUDIO_PLAYER_UPDATE_PARENT_DIR: 'AUDIO_PLAYER_UPDATE_PARENT_DIR',
  AUDIO_PLAYER_UPDATE_TRACKS: 'AUDIO_PLAYER_UPDATE_TRACKS',
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

const updateParentDir = () => ({
  type: types.AUDIO_PLAYER_UPDATE_PARENT_DIR,
  payload: documentDir,
});

const updateTracks = tracks => ({
  type: types.AUDIO_PLAYER_UPDATE_TRACKS,
  payload: tracks,
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
  const updatedTracks = {};
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
      updatedTracks[track.id] = { ...track, url, artwork };
    }
  }
  dispatch(updateTracks(updatedTracks));
  console.log('fixTrackFiles completed... ', updatedTracks);
};

export const fixSongsParentDir = () => async (dispatch, getState) => {
  const dir = parentDir(getState());

  if (dir !== documentDir) {
    console.log('fixSongsParentDir started', dir, documentDir);
    // apparently react-native does not support positive look behind.
    // const replacer = dir ? dir : /(?<=file:\/\/).*(?=\/songs\/.*)/g;
    // const replace = (file: string) => file.replace(replacer, documentDir);
    const replace = (file: string): string => {
      if (dir) {
        return file.replace(dir, documentDir);
      }
      return file.replace(/(file:\/\/).*(\/songs\/.*)/g, `$1${documentDir}$2`);
    };
    const tracks = tracksSelector(getState());
    const updatedTracks = {};
    for (const track of tracks) {
      const url = replace(track.url);
      const artwork = replace(track.artwork);
      console.log('fixSongsParentDir', track, { ...track, url, artwork });
      updatedTracks[track.id] = { ...track, url, artwork };
    }
    batch(() => {
      dispatch(updateTracks(updatedTracks));
      dispatch(updateParentDir());
    });
  }
  console.log('fixSongsParentDir completed...');
};
