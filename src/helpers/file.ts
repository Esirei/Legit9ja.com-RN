import RNFetchBlob from 'rn-fetch-blob';

const { fs } = RNFetchBlob;

const sizeUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
export const fileSize = (size: number): string => {
  let unit = 1;
  let fSize = '';

  for (let i = 0; i < sizeUnits.length; i++) {
    const max = unit * 1024;
    if (size > max && i !== sizeUnits.length - 1) {
      unit = max;
    } else {
      fSize = (size / unit).toFixed(2) + ` ${sizeUnits[i]}`;
      break;
    }
  }
  return fSize;
};

const fileExtensionRegex = /[^.]+$/; // matches file extension

export const getFileExtension = (file: string): string => fileExtensionRegex.exec(file)![0];

const artistTitleRegex = /(?:(.+)[-\s][-–][-\s](.+)|(.+))(?:\.\w{3,4})/; // tries to get artist and title from file

export const getArtistAndTitle = (file: string): { artist: string; title: string } => {
  console.log('getArtistAndTitle called');
  file = file.replace(/_/g, ' ').replace(' Legit9ja com', '');
  const meta = { artist: '', title: '' };
  const regexArray = artistTitleRegex.exec(file)!;
  console.log('getArtistAndTitle Regex', regexArray);
  meta.artist = regexArray[1] || '';
  meta.title = regexArray[2] || regexArray[3] || file;
  console.log('getArtistAndTitle Result', meta);
  return meta;
};

export const deleteFile = async path => {
  const exist = await fs.exists(path);
  exist && (await fs.unlink(path));
};
