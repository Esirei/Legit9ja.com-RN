import { batch } from 'react-redux';
import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import MediaMeta from 'rn-media-meta';
import RNMusicMetadata from 'react-native-music-metadata';
import { makeDownloadSelector } from '@selectors/downloadsSelector';
import { downloadFile, getFileAndExtension } from '@helpers';
import { addTrack } from '@actions/audioPlayerActions';

const { fs } = RNFetchBlob;
const songsDir = RNFetchBlob.fs.dirs.DocumentDir + '/songs';
const downloadCancellers: Record<string, (cb?: (reason) => void) => void> = {};

export const types = {
  DOWNLOAD_STARTED: 'DOWNLOAD_STARTED',
  DOWNLOAD_PROGRESS: 'DOWNLOAD_PROGRESS',
  DOWNLOAD_COMPLETED: 'DOWNLOAD_COMPLETED',
  DOWNLOAD_STOPPED: 'DOWNLOAD_STOPPED',
};

const downloadStarted = ({ url, name, created }) => ({
  type: types.DOWNLOAD_STARTED,
  payload: { url, name, created },
});

const downloadProgress = ({ url, received, total, updated }) => ({
  type: types.DOWNLOAD_PROGRESS,
  payload: { url, received, total, updated },
});

const downloadCompleted = url => ({
  type: types.DOWNLOAD_COMPLETED,
  payload: { url },
});

const downloadStopped = ({ url, error }) => ({
  type: types.DOWNLOAD_STOPPED,
  payload: { url, error },
});

const f = 'file://';
export const startMP3Download = (url: string) => (dispatch, getState) => {
  const download = makeDownloadSelector(url)(getState());
  const now = Date.now();
  if (download && download.isDownloading && download.updated > now - 10000) {
    console.log(`Download of ${url} already running...`);
    return;
  }
  const created = (download && download.created) || now;
  const name = (download && download.name) || getFileAndExtension(url).file || url;
  dispatch(downloadStarted({ url, name, created }));

  const progress = (received, total) => {
    const updated = Date.now();
    dispatch(downloadProgress({ url, received, total, updated }));
    const percent = (received / total) * 100;
    if (percent > 75) {
      // console.log(`Download of ${url} cancelled at 75%+...`);
      // cancelDownload(url);
    }
  };

  downloadFile(url, { progress, dir: songsDir })
    .then(fileDownload => {
      console.log(`Download of ${url} started...`);
      downloadCancellers[url] = fileDownload.cancel;
      fileDownload.expire(() => {
        console.log(`Download of ${url} expired...`);
      });
      return fileDownload.promise.then(stat => {
        console.log(`Saved ${url} download stat...`, stat);
        const { filename, path, size, lastModified } = stat;
        const artwork = `${path}.jpg`;

        const saveMeta = meta => {
          const { thumb, ...restMeta } = meta;
          console.log('Meta save here...', meta);
          const file = { added: lastModified, size, url: encodeURI(f + path), id: url };
          const metadata = { artwork: thumb ? encodeURI(f + artwork) : '', ...restMeta, ...file };
          return fs.writeFile(artwork, thumb || '', 'base64').then(() => metadata);
        };

        if (Platform.OS === 'ios') {
          return RNMusicMetadata.getMetadata([path]).then(metas => {
            const meta = metas[0];
            const thumb = meta.artwork;
            delete meta.artwork;
            delete meta.uri;
            return saveMeta({ ...meta, thumb });
          });
        }

        return MediaMeta.get(path, {
          thumbCompression: undefined,
          thumbMaxWidth: undefined,
          thumbMaxHeight: undefined,
        }).then(meta => {
          delete meta.height;
          delete meta.width;
          return saveMeta(meta);
        });
      });
    })
    .then(meta => {
      console.log(`Download of ${url} completed...`, meta);
      batch(() => {
        dispatch(downloadCompleted(url));
        dispatch(addTrack(meta));
      });
    })
    .catch(error => {
      dispatch(downloadStopped({ url, error }));
    });
};

export const cancelDownload = url => {
  const cancel = downloadCancellers[url];
  if (cancel) {
    cancel(reason => {
      console.log(`Download of ${url} cancelled...`, reason);
    });
  }
};
