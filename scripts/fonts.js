const fs = require('fs');

const resourceDir = 'src/assets/';
const fontsDir = `${resourceDir}fonts/`;
const filePath = `${resourceDir}fonts.js`;

const fontFileNames = () => {
  const array = fs
    .readdirSync(fontsDir)
    .filter(file => file !== 'selection.json')
    .filter(file => file.endsWith('.ttf') || file.endsWith('.otf'))
    .map(file => file.replace('.ttf', '').replace('.otf', ''));
  return Array.from(new Set(array));
};

const generate = () => {
  const properties = fontFileNames()
    .map(name => {
      const key = name.replace(/\s/g, '').replace('-', '_');
      return `${key}: '${name}'`;
    })
    .join(',\n    ');
  const string = `const fonts = {
    ${properties}
};

export default fonts`;

  fs.writeFileSync(filePath, string, 'utf8');
};

generate();
