'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CONFIG_PATHNAME = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.saveConfig = saveConfig;
exports.loadConfig = loadConfig;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CONFIG_PATHNAME = exports.CONFIG_PATHNAME = _path2.default.resolve(process.env.HOME, '.github-clubhouse');

function saveConfig(options) {
  var pathname = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : CONFIG_PATHNAME;

  _fs2.default.writeFileSync(pathname, (0, _stringify2.default)(options), { encoding: 'utf8' });
}

function loadConfig() {
  var pathname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : CONFIG_PATHNAME;

  try {
    var config = _fs2.default.readFileSync(pathname, { encoding: 'utf8' });
    return JSON.parse(config);
  } catch (err) {
    // no config file exists
    return {};
  }
}