'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _blueTape = require('blue-tape');

var _blueTape2 = _interopRequireDefault(_blueTape);

var _nock = require('nock');

var _nock2 = _interopRequireDefault(_nock);

var _gitHub = require('../gitHub');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _blueTape2.default)('fetchers/gitHub', function (t) {
  t.test('getIssue returns a Promise', function (tt) {
    tt.plan(1);

    /* eslint-disable camelcase */
    var expected = {
      url: 'https://api.github.com/repos/some-owner/some-repo/issues/1',
      id: 123,
      number: 1,
      title: 'found a bug',
      body: 'there is a bug\nin this code'
    };
    (0, _nock2.default)('https://api.github.com').get('/repos/some-owner/some-repo/issues/1').reply(200, (0, _stringify2.default)(expected));

    return (0, _gitHub.getIssue)('not-a-real-token', 'some-owner', 'some-repo', 1).then(function (data) {
      return tt.deepEqual(data, expected);
    });
  });

  t.test('getCommentsForIssue returns a Promise', function (tt) {
    tt.plan(1);

    /* eslint-disable camelcase */
    var expected = [{
      url: 'https://api.github.com/repos/some-owner/some-repo/issues/1/comments/1',
      id: 123,
      body: 'uh oh'
    }, {
      url: 'https://api.github.com/repos/some-owner/some-repo/issues/1/comments/2',
      id: 234,
      body: 'me, too'
    }];
    (0, _nock2.default)('https://api.github.com').get('/repos/some-owner/some-repo/issues/1/comments').reply(200, (0, _stringify2.default)(expected));

    return (0, _gitHub.getCommentsForIssue)('not-a-real-token', 'some-owner', 'some-repo', 1).then(function (data) {
      return tt.deepEqual(data, expected);
    });
  });

  t.end();
});