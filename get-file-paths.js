const dree = require('dree');
const path = require('path');

module.exports = (dirPath, test) => {
  const paths = [];
  dree.scan(dirPath, {}, (file) => {
    if (test.test(file.relativePath)) {
      paths.push({
        fileName: file.name.replace(test, ''),
        filePath: path.resolve(dirPath, file.relativePath),
      });
    }
  });

  return paths;
};
