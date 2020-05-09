import { types } from '@actions/downloadsActions';
import { fileSize } from '@helpers';

export interface Download {
  url: string;
  name: string;
  path: string;
  speed: string;
  isDownloading: boolean;
  completed: boolean;
  received: number;
  total: number;
  created: number;
  updated: number;
  error?: any;
}

export type DownloadsState = Record<string, Download>;

const downloadState: Download = {
  url: '',
  name: '',
  path: '',
  speed: '',
  isDownloading: false,
  completed: false,
  received: 0,
  total: 0,
  created: 0,
  updated: 0,
};

const downloadSpeed = (prev, current) => {
  const bytes = current - prev;
  const size = fileSize(bytes);
  return `${size}/s`;
};

const clearCompleted = (downloads: DownloadsState): DownloadsState => {
  return Object.values(downloads).reduce((state, download) => {
    const { completed, url } = download;
    if (!completed) {
      state[url] = download;
    }
    return state;
  }, {});
};

const downloadReducer = (state = downloadState, action): Download => {
  switch (action.type) {
    case types.DOWNLOAD_START:
      const started = { completed: false, isDownloading: true, error: undefined };
      return { ...state, ...action.payload, ...started };
    case types.DOWNLOAD_STARTED:
      return { ...state, ...action.payload };
    case types.DOWNLOAD_PROGRESS:
      const speed = downloadSpeed(state.received, action.payload.received);
      return { ...state, ...action.payload, speed };
    case types.DOWNLOAD_COMPLETED:
      return { ...state, ...action.payload, isDownloading: false, completed: true };
    case types.DOWNLOAD_STOPPED:
      return { ...state, ...action.payload, isDownloading: false };
    default:
      return state;
  }
};

export default (state = {}, action): DownloadsState => {
  switch (action.type) {
    case types.DOWNLOAD_START:
    case types.DOWNLOAD_STARTED:
    case types.DOWNLOAD_PROGRESS:
    case types.DOWNLOAD_COMPLETED:
    case types.DOWNLOAD_STOPPED:
      const { url } = action.payload;
      return { ...state, [url]: downloadReducer(state[url], action) };
    case types.DOWNLOAD_DELETE:
      delete state[action.payload.url];
      return { ...state };
    case types.DOWNLOAD_CLEAR_COMPLETED:
      return clearCompleted(state);
    default:
      return state;
  }
};
