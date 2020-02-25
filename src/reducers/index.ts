import { combineReducers } from 'redux';
import session from './sessionReducer';
import downloads from './downloadsReducer';
import audioPlayer from './audioPlayerReducer';

export default combineReducers({
  downloads,
  session,
  audioPlayer,
});
