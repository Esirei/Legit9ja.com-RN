import { combineReducers } from 'redux';
import session from './sessionReducer';
import downloads from './downloadsReducer';
import audioPlayer from './audioPlayerReducer';
import toasts from './toastsReducer';

export default combineReducers({
  downloads,
  session,
  audioPlayer,
  toasts,
});
