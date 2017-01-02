'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _blueTape = require('blue-tape');

var _blueTape2 = _interopRequireDefault(_blueTape);

var _nock = require('nock');

var _nock2 = _interopRequireDefault(_nock);

var _apiFetch = require('../apiFetch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _blueTape2.default)('util/apiFetch', function (t) {
  t.test('apiFetch', function (tt) {
    tt.test('throws an APIError if unsuccessful', function (ttt) {
      ttt.plan(2);

      (0, _nock2.default)('https://api.example.com').get('/some/path').reply(401, 'Not Authorized').get('/some/other/path').reply(500, 'Internal Server Error');

      return _promise2.default.all([ttt.shouldFail((0, _apiFetch.apiFetch)('https://api.example.com/some/path')), ttt.shouldFail((0, _apiFetch.apiFetch)('https://api.example.com/some/other/path'))]);
    });

    tt.test('returns a Promise of data if successful', function (tt) {
      tt.plan(1);

      var expectedResults = [{ title: 'first' }, { title: 'second' }];
      (0, _nock2.default)('https://api.example.com').get('/yet/another/path').reply(200, (0, _stringify2.default)(expectedResults));

      return (0, _apiFetch.apiFetch)('https://api.example.com/yet/another/path').then(function (data) {
        return tt.deepEqual(data, expectedResults);
      });
    });

    tt.end();
  });

  t.test('apiFetchAllPages', function (tt) {
    tt.test('returns a Promise of all pages of data if successful', function (ttt) {
      ttt.plan(1);

      var page1Data = [{ title: 'first' }, { title: 'second' }];
      var page2Data = [{ title: 'third' }, { title: 'fourth' }];
      var page3Data = [{ title: 'fifth' }, { title: 'sixth' }];
      var expectedResults = page1Data.concat(page2Data).concat(page3Data);

      (0, _nock2.default)('https://api.example.com').get('/yet/another/path').reply(200, (0, _stringify2.default)(page1Data), {
        Link: '<https://api.example.com/yet/another/path?page=2>; rel="next", <https://api.example.com/yet/another/path?page=3>; rel="last"'
      }).get('/yet/another/path?page=2').reply(200, (0, _stringify2.default)(page2Data), {
        Link: '<https://api.example.com/yet/another/path?page=3>; rel="next", <https://api.example.com/yet/another/path?page=3>; rel="last"'
      }).get('/yet/another/path?page=3').reply(200, (0, _stringify2.default)(page3Data), {
        Link: '<https://api.example.com/yet/another/path?page=3>; rel="last"'
      });

      return (0, _apiFetch.apiFetchAllPages)('https://api.example.com/yet/another/path').then(function (data) {
        return ttt.deepEqual(data, expectedResults);
      });
    });

    tt.end();
  });

  t.end();
});