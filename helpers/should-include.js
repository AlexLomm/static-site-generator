module.exports = (htmlFileName, assetFileNames) => {
  const fileNameWithoutExtension = htmlFileName.split('.')[0];

  return assetFileNames.filter((assetFileName) => {
    return assetFileName.includes(fileNameWithoutExtension) ||
           assetFileName.includes('_global');
  });
};
