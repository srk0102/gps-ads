const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { assetExts, sourceExts }
  } = await getDefaultConfig();
  return {
    resolver: {
      assetExts,
      sourceExts: [...sourceExts, 'cjs']
    }
  };
})();
