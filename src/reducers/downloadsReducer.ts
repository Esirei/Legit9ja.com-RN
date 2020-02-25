import { types } from '@actions/downloadsActions';
import { fileSize } from '@helpers';

export interface Download {
  url: string;
  name: string;
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

const download: Download = {
  url: '',
  name: '',
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

const downloadReducer = (state = download, action): Download => {
  switch (action.type) {
    case types.DOWNLOAD_STARTED:
      return { ...state, ...action.payload, isDownloading: true, error: undefined };
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
    case types.DOWNLOAD_STARTED:
    case types.DOWNLOAD_PROGRESS:
    case types.DOWNLOAD_COMPLETED:
    case types.DOWNLOAD_STOPPED:
      const { url } = action.payload;
      return { ...state, [url]: downloadReducer(state[url], action) };
    default:
      return state;
  }
};
