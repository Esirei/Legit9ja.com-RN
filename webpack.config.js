/**
 * Why is this here you ask? React Native doesn't use Webpack. True. This file is here to trick
 * IDEA in recognizing module aliases (see the package.json files in some of the subdirs).
 * Nice solution? No. Does it work? Sure.
 * Tracker URL: https://youtrack.jetbrains.com/issue/WEB-23221
 *
 * - TS
 */

const fs = require('fs');
const path = require('path');

const walkSync = function(dir, fileList) {
  const files = fs.readdirSync(dir);
  fileList = fileList || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + file).isDirectory()) {
      fileList = walkSync(dir + file + '/', fileList);
    } else if (file === 'package.json') {
      fileList.push([path.resolve(dir), path.resolve(dir + file)]);
    }
  });
  return fileList;
};

const dir = 'src/';
const alias = {};
walkSync(dir).forEach(p => {
  const pkg = require(p[1]);
  alias[pkg.name] = p[0];
});

module.exports = {
  resolve: {
    alias,
  },
};

// Fix tsconfig.json module resolution
try {
  let tsConfig = require('./tsconfig');
  const addLineRegex = [/,/g, ',\n'];
  const replaceSlashRegex = [/\\\\/g, '/']; // Replaces windows dir backslash
  const finalRegExp = new RegExp(`(".*)(".*)(")(.*${dir}|.*src)(.*)(")`, 'g'); // Regex: /(".*)(".*)(")(.*src\/|.*src)(.*)(")/g

  const paths = [addLineRegex, replaceSlashRegex].reduce(
    (string, array) => string.replace(array[0], array[1]),
    JSON.stringify(alias),
  );
  const indexPaths = paths.replace(finalRegExp, '$1$2[$3$5$6]');
  const wildcardPaths = paths.replace(finalRegExp, '$1/*$2[$3$5/*$6]');

  const allPaths = { ...JSON.parse(indexPaths), ...JSON.parse(wildcardPaths) };
  const sortedPaths = {};
  Object.keys(allPaths)
    .sort()
    .forEach(key => (sortedPaths[key] = allPaths[key]));

  const data = {
    baseUrl: `./${dir}`,
    paths: sortedPaths,
  };

  tsConfig = {
    ...tsConfig,
    compilerOptions: { ...(tsConfig.compilerOptions || {}), ...data },
  };
  const arrayReplacer = (k, v) => (v instanceof Array ? JSON.stringify(v) : v); // leaves arrays in single line.
  const arrayReplaces = [
    // fixes issues with arrays being string
    [/\\/g, ''],
    [/"\[/g, '['],
    [/]"/g, ']'],
    [/","/g, '", "'],
  ];

  const TsConfig =
    arrayReplaces.reduce((string, array) => {
      return string.replace(array[0], array[1]);
    }, JSON.stringify(tsConfig, arrayReplacer, 2)) + '\n';

  fs.writeFileSync('tsconfig.json', TsConfig, 'utf8');
} catch (e) {
  console.error('tsconfig.json not found');
}
