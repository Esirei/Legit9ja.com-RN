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
