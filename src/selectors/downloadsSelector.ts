import { createSelector } from 'reselect';
import { Download } from '@reducers/downloadsReducer';
import { AppState } from '@types';

const getDownload = (url, downloads): Download | null => downloads[url];
const sortByCreation = (a: Download, b: Download) => `${b.created}`.localeCompare(`${a.created}`);

const downloadsStateSelector = (state: AppState) => state.downloads;

export const downloadsSelector = createSelector(
  downloadsStateSelector,
  downloads => Object.values(downloads).sort(sortByCreation),
);

export const makeDownloadSelector = url => {
  return createSelector(
    downloadsStateSelector,
    downloads => getDownload(url, downloads),
  );
};
