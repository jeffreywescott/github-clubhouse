'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _configPathname = function _configPathname() {
  return _path2.default.resolve('/tmp', '.github-clubhouse-' + Date.now());
};

(0, _tape2.default)('util/config', function (t) {
  t.test('saveConfig', function (tt) {
    tt.test('saves the configuration options', function (ttt) {
      ttt.plan(1);

      var pathname = _configPathname();
      var options = { save: 'me' };
      (0, _config.saveConfig)(options, pathname);
      var savedOptions = JSON.parse(_fs2.default.readFileSync(pathname, { encoding: 'utf8' }));

      ttt.equal(savedOptions.save, options.save);
    });

    tt.end();
  });

  t.test('loadConfig', function (tt) {
    tt.test('returns an empty object if no configuration exists', function (ttt) {
      ttt.plan(1);

      var pathname = _configPathname();
      var loadedOptions = (0, _config.loadConfig)(pathname);

      ttt.deepEqual(loadedOptions, {});
    });

    tt.test('returns the options as an object if the configuration exists', function (ttt) {
      ttt.plan(1);

      var pathname = _configPathname();
      var options = { save: 'me' };
      _fs2.default.writeFileSync(pathname, (0, _stringify2.default)(options), { encoding: 'utf8' });
      var loadedOptions = (0, _config.loadConfig)(pathname);

      ttt.equal(loadedOptions.save, options.save);
    });

    tt.end();
  });

  t.end();
});