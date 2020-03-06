import RNFetchBlob from 'rn-fetch-blob';
import MediaMeta from 'rn-media-meta';
import { fileSize } from '@helpers/file';

const { fs } = RNFetchBlob;
const downloadsDir = RNFetchBlob.fs.dirs.DocumentDir;

const urlFileRegex = /[^/\\&?]+\.(\w{3,4})(?=(?:[?&].*$|$))/; // matches file in download url, also groups file extension

export const getFileAndExtension = (url: string): { file: string; ext: string } => {
  const [file, ext] = urlFileRegex.exec(decodeURI(url))!;
  return { file, ext };
};

interface DownloadConfig {
  dir?: string;
  started?: (path) => void;
  progress?: (received, total) => void;
}

export const downloadFile = (url: string, config?: DownloadConfig) => {
  const dir = (config && config.dir) || downloadsDir;
  let file = urlFileRegex.exec(url)![0];
  file = file.replace(/%E2%80%93/g, '-');
  file = decodeURI(file);
  const filePath = `${dir}/${file}`;
  const tempPath = `${filePath}.download`;
  console.log('File Download: ', file);

  return fs
    .exists(tempPath)
    .then(tempExist => {
      if (tempExist) {
        return fs
          .appendFile(filePath, tempPath, 'uri')
          .then(() => fs.writeFile(tempPath, '', 'base64'))
          .then(() => fs.stat(filePath));
      }
      return fs.exists(filePath).then(fileExist => {
        if (fileExist) {
          return fs.stat(filePath);
        }
        return Promise.resolve({ size: 0 });
      });
    })
    .then(stat => {
      console.log(`File Download ${file} starting...`, stat);
      config && config.started && config.started(filePath);
      const task = RNFetchBlob.config({
        path: tempPath,
        IOSBackgroundTask: true,
      })
        .fetch('GET', url, { Range: `bytes=${stat.size}-` })
        .progress({ interval: 1000 }, (received, total) => {
          received = Number(received) + stat.size;
          total = Number(total) + stat.size;
          console.log({ received, total });
          console.log(
            'progress ' + Math.floor((received / total) * 100) + '%',
            fileSize(received) + '/' + fileSize(total),
          );
          config && config.progress && config.progress(received, total);
        });

      const promise = task
        .then(download => {
          const status = download.respInfo.status;
          console.log(download);
          if (status >= 200 && status < 300) {
            console.log('File Downloaded Successfully', download.respInfo);
            return fs.appendFile(filePath, download.path(), 'uri');
          }
        })
        .then(() => fs.unlink(tempPath))
        .then(() => fs.stat(filePath));

      return {
        promise,
        cancel: task.cancel,
        expire: task.expire,
      };
    });
};

// type Executor<T> = (
//   resolve: (value?: T | PromiseLike<T>) => void,
//   reject: (reason?: any) => void,
// ) => void;
//
// class FileDownload<T> extends Promise<T> {
//   private task;
//   constructor(task, executor: Executor<T>) {
//     super(executor);
//     this.task = task;
//   }
//
//   cancel = this.task.cancel;
//   expire = this.task.expire;
// }
