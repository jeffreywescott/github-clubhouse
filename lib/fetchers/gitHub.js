'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIssue = getIssue;
exports.getCommentsForIssue = getCommentsForIssue;

var _apiFetch = require('../util/apiFetch');

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