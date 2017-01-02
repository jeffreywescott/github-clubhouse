'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.listUsers = listUsers;
exports.listProjects = listProjects;
exports.createStory = createStory;

var _apiFetch = require('../util/apiFetch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var headers = {
  'Content-Type': 'application/json'
};

function apiURL(path, token) {
  return 'https://api.clubhouse.io/api/v1' + path + '?token=' + token;
}

function listUsers(token) {
  var projectsUrl = apiURL('/users', token);
  return (0, _apiFetch.apiFetch)(projectsUrl, { headers: headers });
}

function listProjects(token) {
  var projectsUrl = apiURL('/projects', token);
  return (0, _apiFetch.apiFetch)(projectsUrl, { headers: headers });
}

function createStory(token, story) {
  var storyUrl = apiURL('/stories', token);
  return (0, _apiFetch.apiFetch)(storyUrl, { method: 'POST', headers: headers, body: (0, _stringify2.default)(story) });
}