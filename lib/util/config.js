'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.saveConfig = saveConfig;
exports.createConfigIfNotExists = createConfigIfNotExists;
exports.loadConfig = loadConfig;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CONFIG_PATHNAME = _path2.default.resolve(process.env.HOME, '.github-clubhouse');

function saveConfig(options) {
  _fs2.default.writeFileSync(CONFIG_PATHNAME, (0, _stringify2.default)(options), { encoding: 'utf8' });
}

function createConfigIfNotExists(options) {
  try {
    _fs2.default.statSync(CONFIG_PATHNAME);
  } catch (err) {
    saveConfig(options);
  }
}

function loadConfig() {
  try {
    var config = _fs2.default.readFileSync(CONFIG_PATHNAME, { encoding: 'utf8' });
    return JSON.parse(config);
  } catch (err) {
    return {};
  }
}