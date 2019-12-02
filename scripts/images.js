const fs = require('fs');
const path = require('path');

const defaultSpace = ' '.repeat(2);
const folderSuffix = '_images';
const resourceDir = 'src/assets/';
const imagesDir = `${resourceDir}images/`;
const filePath = `${resourceDir}images.js`;
const replaces = ['@2x.png', '@3x.png', '.png'];

const space = spacing => spacing + defaultSpace;

function imagesObject(dir, spacing = '') {
  const array = fs.readdirSync(dir);
  const directories = [];
  const images = [];
  array.forEach(file => {
    if (fs.statSync(dir + file).isDirectory()) {
      directories.push(dir + file + '/');
    } else if (file.endsWith('.png')) {
      // const filename = file
      //   .replace('@2x.png', '')
      //   .replace('@3x.png', '')
      //   .replace('.png', '');
      const filename = replaces.reduce((f, r) => f.replace(r, ''), file);
      images.push(filename);
    }
  });
  const newSpace = space(spacing);
  return `{${images.length > 0 ? mapFiles(images, dir, newSpace) : ''}${directories.length > 0 ? mapDirectories(directories, newSpace) : ''}\n${spacing}}`;
}

function mapFiles(files, dir, spacing) {
  const mappedFiles = Array.from(new Set(files))
    .map(name => `'${name}': require('${dir}${name}.png')`.replace(resourceDir, './'))
    .join(',\n' + spacing);

  return `\n${spacing}${mappedFiles},`;
}

function mapDirectories(directories, spacing) {
  const mappedDirectories = directories
    .map(directory => `${dirName(directory)}: ${imagesObject(directory, spacing)}`)
    .join(',\n' + spacing);

  return `\n${spacing}${mappedDirectories}`;
}

const dirName = dir => path.parse(dir).name
  .replace('-', '_')
  .replace(' ', '_') + folderSuffix;

function generate() {
  const string = `const images = ${imagesObject(imagesDir)};\n\nexport default images`;

  fs.writeFileSync(filePath, string, 'utf8');
}

generate();
