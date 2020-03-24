// TODO DELETE FILE AS IT'S NOT IN USE
import RNFS, { DownloadBeginCallbackResult, DownloadProgressCallbackResult } from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import { postImage } from './post';
import { fileSize } from './file';

export const songsDir = RNFS.DocumentDirectoryPath + '/songs';
export const videosDir = RNFS.DocumentDirectoryPath + '/videos';
export const coversDir = RNFS.DocumentDirectoryPath + '/covers';

const urlFileRegex = /[^/\\&?]+\.(\w{3,4})(?=(?:[?&].*$|$))/; // matches file in download url, also groups file extension
const artistTitleRegex = /(?:(.+)[-\s][-–][-\s](.+)|(.+))(?:\.\w{3,4})/; // tries to get artist and title from file

export const downloadTrack = async (url: string, post) => {
  const artwork = postImage(post);
  let file = urlFileRegex.exec(decodeURI(url))![0];
  file = file.replace(/_/g, ' ').replace(' Legit9ja com', '');
  const name = file.replace('.mp3', '');
  const meta = { postId: post.id, artist: '', title: '', artwork, url, id: url };
  const regexArray = artistTitleRegex.exec(file)!;
  if (regexArray[1] && regexArray[2]) {
    meta.artist = regexArray[1];
    meta.title = regexArray[2];
  } else if (regexArray[3]) {
    meta.title = regexArray[3];
  }

  // meta.artist = regexArray[1] || regexArray[3] || '';
  const filePath = RNFetchBlob.fs.dirs.DocumentDir + `/tracks/${file}`;
  const artworkPath = RNFetchBlob.fs.dirs.DocumentDir + `/tracks/${file}`;

  console.log('downloadTrack', file, name, meta);

  const useRNFBlob = true;
  console.log('useRNFBlob', useRNFBlob);

  // return;
  if (useRNFBlob) {
    const fetch = RNFetchBlob.config({
      path: filePath,
    }).fetch('GET', url);

    fetch.progress({ interval: 1000 }, (received, total) => {
      console.log(
        'progress ' + Math.floor((received / total) * 100) + '%',
        fileSize(received) + '/' + fileSize(total),
      );
    });

    fetch
      .then(value => {
        console.log(value, value.path());
      })
      .catch(reason => {
        console.log('download error', reason);
      });
  } else {
    const begin = (res: DownloadBeginCallbackResult) => {
      console.log('begin', res);
    };
    const progress = (res: DownloadProgressCallbackResult) => {
      console.log(
        'progress ' + Math.floor((res.bytesWritten / res.contentLength) * 100) + '%',
        fileSize(res.bytesWritten) + '/' + fileSize(res.contentLength),
      );
      // console.log('progress', res);
    };

    const toFile = RNFetchBlob.fs.dirs.DocumentDir + `/tracks/${file}`;

    const download = RNFS.downloadFile({
      fromUrl: url,
      toFile,
      begin,
      progress,
    });

    console.log('download', download);

    download.promise
      .then(value => {
        console.log('download result', value);
      })
      .catch(reason => {
        console.log('download error', reason);
      });
  }
};

const createDirIfNotExist = async dir => {
  try {
    await RNFS.mkdir(dir, { NSURLIsExcludedFromBackupKey: true });
  } catch (e) {
    console.log('createDirIfNotExist error', e);
    await Promise.reject(e);
  }
};
