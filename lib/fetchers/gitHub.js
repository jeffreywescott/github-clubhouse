'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.getIssue = getIssue;
exports.getCommentsForIssue = getCommentsForIssue;
exports.createIssue = createIssue;
exports.createIssueComment = createIssueComment;

var _apiFetch = require('../util/apiFetch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function headers(token) {
  return {
    Authorization: 'token ' + token,
    Accept: 'application/vnd.github.v3+json'
  };
}

function apiURL(path) {
  return 'https://api.github.com' + path;
}

function getIssue(token, owner, repoName, issueNumber) {
  var issueUrl = apiURL('/repos/' + owner + '/' + repoName + '/issues/' + issueNumber);
  return (0, _apiFetch.apiFetch)(issueUrl, { headers: headers(token) });
}

function getCommentsForIssue(token, owner, repoName, issueNumber) {
  var commentsUrl = apiURL('/repos/' + owner + '/' + repoName + '/issues/' + issueNumber + '/comments');
  return (0, _apiFetch.apiFetchAllPages)(commentsUrl, { headers: headers(token) });
}

function createIssue(token, owner, repoName, issue) {
  var newIssueUrl = apiURL('/repos/' + owner + '/' + repoName + '/issues');
  return (0, _apiFetch.apiFetch)(newIssueUrl, {
    method: 'POST',
    headers: headers(token),
    body: (0, _stringify2.default)(issue)
  });
}

function createIssueComment(token, owner, repoName, issueNumber, comment) {
  var newCommentUrl = apiURL('/repos/' + owner + '/' + repoName + '/issues/' + issueNumber + '/comments');
  return (0, _apiFetch.apiFetch)(newCommentUrl, {
    method: 'POST',
    headers: headers(token),
    body: (0, _stringify2.default)(comment)
  });
}