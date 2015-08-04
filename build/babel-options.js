var paths = require('./paths');
var path = require('path');

module.exports = {
  filename: '',
  filenameRelative: '',
  modules: '',
  sourceMap: true,
  sourceMapName: '',
  sourceRoot: '',
  moduleRoot: path.resolve('src').replace(/\\/g, '/'),
  moduleIds: false,
  experimental: false,
  comments: false,
  compact: false,
  code:true,
  stage:2,
  loose: "all",
  optional: [
    "es7.decorators",
    "es7.classProperties"
  ],
  plugins: [
    "babel-dts-generator"
  ],
  extra: {
    dts: {
      packageName: paths.packageName,
      typings: '',
      suppressModulePath: true,
      suppressComments: false,
      memberOutputFilter: /^_.*/
    }
  }
};
