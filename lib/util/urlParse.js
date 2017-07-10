'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.parseClubhouseStoryURL = parseClubhouseStoryURL;
exports.parseGithubIssueURL = parseGithubIssueURL;
exports.parseGithubRepoURL = parseGithubRepoURL;

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseClubhouseStoryURL(clubhouseStoryURL) {
  var _url$parse = _url2.default.parse(clubhouseStoryURL),
      hostname = _url$parse.hostname,
      pathname = _url$parse.pathname;

  if (hostname !== 'app.clubhouse.io') {
    throw new Error(clubhouseStoryURL + ' is not a valid Clubhouse story URL');
  }

  var pathParts = pathname.split('/');
  var orgSlug = pathParts[1];
  var storyId = parseInt(pathParts[3], 10);
  if (!orgSlug.length > 0 || !storyId > 0) {
    throw new Error(clubhouseStoryURL + ' is not a valid Clubhouse story URL');
  }
  return {
    orgSlug: orgSlug,
    storyId: storyId
  };
}

function parseGithubIssueURL(githubIssueURL) {
  var _url$parse2 = _url2.default.parse(githubIssueURL),
      hostname = _url$parse2.hostname,
      pathname = _url$parse2.pathname;

  if (hostname !== 'github.com') {
    throw new Error(githubIssueURL + ' is not a valid GitHub issue URL');
  }

  var pathParts = pathname.split('/');
  var owner = pathParts[1];
  var repo = pathParts[2];
  var issueNumber = parseInt(pathParts[4], 10);
  if (!owner.length > 0 || !repo.length > 0 || !issueNumber > 0) {
    throw new Error(githubIssueURL + ' is not a valid GitHub issue URL');
  }

  return {
    owner: owner,
    repo: repo,
    issueNumber: issueNumber
  };
}

function parseGithubRepoURL(githubRepoURL) {
  var _url$parse3 = _url2.default.parse(githubRepoURL),
      hostname = _url$parse3.hostname,
      pathname = _url$parse3.pathname;

  if (hostname !== 'github.com') {
    throw new Error(githubRepoURL + ' is not a valid GitHub repository');
  }

  var _pathname$split = pathname.split('/'),
      _pathname$split2 = (0, _slicedToArray3.default)(_pathname$split, 3),
      _ = _pathname$split2[0],
      owner = _pathname$split2[1],
      repo = _pathname$split2[2];

  if (!owner.length > 0 || !repo.length > 0) {
    throw new Error(githubRepoURL + ' is not a valid GitHub repository');
  }

  return { owner: owner, repo: repo };
}