'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.githubIssueToClubhouseStory = exports.clubhouseStoryToGithubIssue = exports.loadConfig = exports.saveConfig = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var clubhouseStoryToGithubIssue = exports.clubhouseStoryToGithubIssue = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(clubhouseStoryId, githubRepoURL) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var _repoAndOwnerFromGith, owner, repo, clubhouseUsers, clubhouseUsersById, story, unsavedIssue, unsavedIssueComments, issue;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _assertOption('githubToken', options);
            _assertOption('clubhouseToken', options);

            _repoAndOwnerFromGith = _repoAndOwnerFromGithubRepoURL(githubRepoURL), owner = _repoAndOwnerFromGith.owner, repo = _repoAndOwnerFromGith.repo;
            _context.next = 5;
            return (0, _clubhouse.listUsers)(options.clubhouseToken);

          case 5:
            clubhouseUsers = _context.sent;
            clubhouseUsersById = clubhouseUsers.reduce(function (acc, user) {
              acc[user.id] = user;
              return acc;
            });
            _context.next = 9;
            return (0, _clubhouse.getStory)(options.clubhouseToken, clubhouseStoryId);

          case 9:
            story = _context.sent;
            unsavedIssue = _storyToIssue(story);
            unsavedIssueComments = _presentClubhouseComments(story.comments, clubhouseUsersById);
            _context.next = 14;
            return (0, _gitHub.createIssue)(options.githubToken, owner, repo, unsavedIssue);

          case 14:
            issue = _context.sent;
            _context.next = 17;
            return _bluebird2.default.each(unsavedIssueComments, function (comment) {
              return (0, _gitHub.createIssueComment)(options.githubToken, owner, repo, issue.number, comment);
            });

          case 17:
            return _context.abrupt('return', issue);

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function clubhouseStoryToGithubIssue(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var githubIssueToClubhouseStory = exports.githubIssueToClubhouseStory = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(githubIssueURL, clubhouseProject) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var users, authorId, projects, _projects$find, projectId, issueRegExp, _githubIssueURL$match, _githubIssueURL$match2, _, owner, repo, issueNumber, issue, issueComments, unsavedStory, story;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _assertOption('githubToken', options);
            _assertOption('clubhouseToken', options);

            _context2.next = 4;
            return (0, _clubhouse.listUsers)(options.clubhouseToken);

          case 4:
            users = _context2.sent;
            authorId = users[0].id;
            _context2.next = 8;
            return (0, _clubhouse.listProjects)(options.clubhouseToken);

          case 8:
            projects = _context2.sent;
            _projects$find = projects.find(function (project) {
              return project.name === clubhouseProject;
            }), projectId = _projects$find.id;
            issueRegExp = /https?:\/\/github.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/;
            _githubIssueURL$match = githubIssueURL.match(issueRegExp), _githubIssueURL$match2 = (0, _slicedToArray3.default)(_githubIssueURL$match, 4), _ = _githubIssueURL$match2[0], owner = _githubIssueURL$match2[1], repo = _githubIssueURL$match2[2], issueNumber = _githubIssueURL$match2[3];
            _context2.next = 14;
            return (0, _gitHub.getIssue)(options.githubToken, owner, repo, issueNumber);

          case 14:
            issue = _context2.sent;
            _context2.next = 17;
            return (0, _gitHub.getCommentsForIssue)(options.githubToken, owner, repo, issueNumber);

          case 17:
            issueComments = _context2.sent;
            unsavedStory = _issueToStory(authorId, projectId, issue, issueComments);
            story = (0, _clubhouse.createStory)(options.clubhouseToken, unsavedStory);
            return _context2.abrupt('return', story);

          case 21:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function githubIssueToClubhouseStory(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

var _config = require('./util/config');

Object.defineProperty(exports, 'saveConfig', {
  enumerable: true,
  get: function get() {
    return _config.saveConfig;
  }
});
Object.defineProperty(exports, 'loadConfig', {
  enumerable: true,
  get: function get() {
    return _config.loadConfig;
  }
});

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

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
    comments: _presentGithubComments(authorId, issueComments),
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    external_id: issue.url
  };
}

function _presentGithubComments(authorId, issueComments) {
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

function _repoAndOwnerFromGithubRepoURL(githubRepoURL) {
  var _url$parse = _url2.default.parse(githubRepoURL),
      hostname = _url$parse.hostname,
      pathname = _url$parse.pathname;

  if (!hostname === 'github.com') {
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

function _storyToIssue(story) {
  var renderedTasks = story.tasks.map(function (task) {
    return '- [' + (task.complete ? 'x' : ' ') + '] ' + task.description;
  }).join('\n');
  var renderedTasksSection = renderedTasks.length > 0 ? '\n### Tasks\n\n' + renderedTasks : '';

  return {
    title: story.name,
    body: '' + story.description + renderedTasksSection
  };
}

function _presentClubhouseComments(comments, clubhouseUsersById) {
  return comments.map(function (comment) {
    var user = clubhouseUsersById[comment.author_id] || { username: comment.author_id };
    return {
      body: '**[Comment from Clubhouse user @' + user.username + ':]** ' + comment.text
    };
  });
}