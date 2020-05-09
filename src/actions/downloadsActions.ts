import { batch } from 'react-redux';
import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import MediaMeta from 'rn-media-meta';
import RNMusicMetadata from 'react-native-music-metadata';
import { makeDownloadSelector } from '@selectors/downloadsSelector';
import { downloadFile, getFileAndExtension, getArtistAndTitle, deleteFile } from '@helpers';
import { addTrack, deleteTrack } from '@actions/audioPlayerActions';
import { makeTrackSelector } from '@selectors/audioPlayerSelectors';
import { addToast } from '@actions/toastsActions';

const { fs } = RNFetchBlob;
const songsDir = RNFetchBlob.fs.dirs.DocumentDir + '/songs';
const downloadCancellers: Record<string, (cb?: (reason) => void) => void> = {};

export const types = {
  DOWNLOAD_START: 'DOWNLOAD_START',
  DOWNLOAD_STARTED: 'DOWNLOAD_STARTED',
  DOWNLOAD_PROGRESS: 'DOWNLOAD_PROGRESS',
  DOWNLOAD_COMPLETED: 'DOWNLOAD_COMPLETED',
  DOWNLOAD_STOPPED: 'DOWNLOAD_STOPPED',
  DOWNLOAD_DELETE: 'DOWNLOAD_DELETE',
  DOWNLOAD_CLEAR_COMPLETED: 'DOWNLOAD_CLEAR_COMPLETED',
};

const downloadStart = ({ url, name, created }) => ({
  type: types.DOWNLOAD_START,
  payload: { url, name, created },
});

const downloadStarted = ({ url, path }) => ({
  type: types.DOWNLOAD_STARTED,
  payload: { url, path },
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

const downloadDelete = ({ url }) => ({
  type: types.DOWNLOAD_DELETE,
  payload: { url },
});

export const clearCompletedDownloads = () => ({
  type: types.DOWNLOAD_CLEAR_COMPLETED,
});

const f = 'file://';
export const startMP3Download = (url: string, tries = 0) => (dispatch, getState) => {
  const download = makeDownloadSelector(url)(getState());
  const now = Date.now();
  if (download && download.isDownloading && download.updated > now - 10000) {
    console.log(`Download of ${url} already running...`);
    return;
  }
  const created = (download && download.created) || now;
  const name = (download && download.name) || getFileAndExtension(url).file || url;
  batch(() => {
    dispatch(downloadStart({ url, name, created }));
    !download && dispatch(addToast({ message: 'Download added...' }));
  });

  const started = path => {
    dispatch(downloadStarted({ url, path }));
    tries = 0;
  };

  const progress = (received, total) => {
    const updated = Date.now();
    dispatch(downloadProgress({ url, received, total, updated }));
  };

  downloadFile(url, { started, progress, dir: songsDir })
    .then(fileDownload => {
      console.log(`Download of ${url} started...`, tries);
      downloadCancellers[url] = fileDownload.cancel;
      fileDownload.expire(() => {
        console.log(`Download of ${url} expired...`);
      });
      return fileDownload.promise.then(stat => {
        console.log(`Saved ${url} download stat...`, stat);
        const { filename, path, size, lastModified } = stat;
        const artwork = `${path}.jpg`;

        const saveMeta = meta => {
          const { thumb, artist, title, ...restMeta } = meta;
          console.log('Meta save here...', meta);
          const file = { added: lastModified, size, url: encodeURI(f + path), id: url }; // need to encode url because of iOS
          const metadata = {
            ...restMeta,
            ...file,
            artwork: thumb ? encodeURI(f + artwork) : '', // need to encode url because of iOS's track-player requires encoded path
            artist: artist ? artist.trim() : '',
            title: title ? title.trim() : '',
          };
          if (!artist || !title) {
            const m = getArtistAndTitle(filename);
            !artist && (metadata.artist = m.artist);
            !title && (metadata.title = m.title);
          }
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
        dispatch(addToast({ message: 'Download completed', subtitle: meta.title }));
      });
      delete downloadCancellers[url];
    })
    .catch(error => {
      console.log(`Download of ${url} error...`, error);
      dispatch(downloadStopped({ url, error }));
      if (tries < 3 && error && error.message && error.message === 'Download interrupted.') {
        dispatch(startMP3Download(url, ++tries));
      }
    });
};

// not a redux action
export const pauseDownload = url => {
  const cancel = downloadCancellers[url];
  if (cancel) {
    cancel(reason => {
      console.log(`Download of ${url} cancelled...`, reason);
      delete downloadCancellers[url];
    });
  }
};

export const deleteDownload = (url: string) => async (dispatch, getState) => {
  const download = makeDownloadSelector(url)(getState());
  const track = makeTrackSelector(url)(getState());
  if (track) {
    dispatch(deleteTrack(track));
  }
  if (download) {
    download.isDownloading && pauseDownload(download.url);
    const { path } = download;
    const tempPath = `${path}.download`;
    const artwork = `${path}.jpg`;
    await deleteFile(tempPath);
    await deleteFile(path);
    await deleteFile(artwork);
    dispatch(downloadDelete({ url }));
  }
};
