'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _blueTape = require('blue-tape');

var _blueTape2 = _interopRequireDefault(_blueTape);

var _nock = require('nock');

var _nock2 = _interopRequireDefault(_nock);

var _clubhouse = require('../clubhouse');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _blueTape2.default)('fetchers/clubhouse', function (t) {
  t.test('listUsers returns a Promise', function (tt) {
    tt.plan(1);

    /* eslint-disable camelcase */
    var expected = [{
      id: 123,
      deactivated: false,
      name: 'foo',
      username: 'foo'
    }];

    (0, _nock2.default)('https://api.clubhouse.io').get('/api/v1/users?token=not-a-real-token').reply(200, (0, _stringify2.default)(expected));

    return (0, _clubhouse.listUsers)('not-a-real-token').then(function (data) {
      return tt.deepEqual(data, expected);
    });
  });

  t.test('listProjects returns a Promise', function (tt) {
    tt.plan(1);

    /* eslint-disable camelcase */
    var expected = [{
      id: 123,
      archived: false,
      name: 'foo',
      abbreviation: 'foo',
      description: 'the foo project',
      color: 'blue',
      created_at: '2016-12-31T12:30:00Z',
      updated_at: '2016-12-31T12:30:00Z'
    }];

    (0, _nock2.default)('https://api.clubhouse.io').get('/api/v1/projects?token=not-a-real-token').reply(200, (0, _stringify2.default)(expected));

    return (0, _clubhouse.listProjects)('not-a-real-token').then(function (data) {
      return tt.deepEqual(data, expected);
    });
  });

  t.test('createStory returns a Promise', function (tt) {
    tt.plan(1);

    /* eslint-disable camelcase */
    var story = {
      project_id: 123,
      name: 'a new story',
      description: 'this is a fairy tale; enjoy it',
      archived: false,
      comments: [{
        id: 123,
        author_id: '00000000-1111-2222-3333-444444444444',
        text: 'a comment'
      }]
    };
    var expected = (0, _extends3.default)({ id: 123 }, story);
    (0, _nock2.default)('https://api.clubhouse.io').post('/api/v1/stories?token=not-a-real-token').reply(200, (0, _stringify2.default)(expected));

    return (0, _clubhouse.createStory)('not-a-real-token', story).then(function (data) {
      return tt.deepEqual(data, expected);
    });
  });

  t.end();
});