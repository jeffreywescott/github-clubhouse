'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.githubIssueToClubhouseStory = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/* eslint-disable import/prefer-default-export */
var githubIssueToClubhouseStory = exports.githubIssueToClubhouseStory = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(githubIssueURL, clubhouseProject) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var users, authorId, projects, _projects$find, projectId, issueRegExp, _githubIssueURL$match, _githubIssueURL$match2, _, owner, repo, issueNumber, issue, issueComments, unsavedStory, story;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _assertOption('githubToken', options);
            _assertOption('clubhouseToken', options);

            _context.next = 4;
            return (0, _clubhouse.listUsers)(options.clubhouseToken);

          case 4:
            users = _context.sent;
            authorId = users[0].id;
            _context.next = 8;
            return (0, _clubhouse.listProjects)(options.clubhouseToken);

          case 8:
            projects = _context.sent;
            _projects$find = projects.find(function (project) {
              return project.name === clubhouseProject;
            }), projectId = _projects$find.id;
            issueRegExp = /https?:\/\/github.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/;
            _githubIssueURL$match = githubIssueURL.match(issueRegExp), _githubIssueURL$match2 = (0, _slicedToArray3.default)(_githubIssueURL$match, 4), _ = _githubIssueURL$match2[0], owner = _githubIssueURL$match2[1], repo = _githubIssueURL$match2[2], issueNumber = _githubIssueURL$match2[3];
            _context.next = 14;
            return (0, _gitHub.getIssue)(options.githubToken, owner, repo, issueNumber);

          case 14:
            issue = _context.sent;
            _context.next = 17;
            return (0, _gitHub.getCommentsForIssue)(options.githubToken, owner, repo, issueNumber);

          case 17:
            issueComments = _context.sent;
            unsavedStory = _issueToStory(authorId, projectId, issue, issueComments);
            story = (0, _clubhouse.createStory)(options.clubhouseToken, unsavedStory);
            return _context.abrupt('return', story);

          case 21:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function githubIssueToClubhouseStory(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _gitHub = require('./fetchers/gitHub');

var _clubhouse = require('./fetchers/clubhouse');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _assertOption(name, options) {
  if (!options[name]) {
    throw new Error(name + ' option must be provided');
  }
}

/* eslint-disable camelcase */
function _issueToStory(authorId, projectId, issue, issueComments) {
  return {
    project_id: projectId,
    name: issue.title,
    description: issue.body,
    comments: _presentComments(authorId, issueComments),
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    external_id: issue.url
  };
}

function _presentComments(authorId, issueComments) {
  return issueComments.map(function (issueComment) {
    return {
      author_id: authorId,
      text: '**[Comment from GitHub user @' + issueComment.user.login + ':]** ' + issueComment.body,
      created_at: issueComment.created_at,
      updated_at: issueComment.updated_at,
      external_id: issueComment.url
    };
  });
}