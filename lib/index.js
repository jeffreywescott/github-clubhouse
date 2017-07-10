'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.githubIssueToClubhouseStory = exports.clubhouseStoryToGithubIssue = exports.loadConfig = exports.saveConfig = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var clubhouseStoryToGithubIssue = exports.clubhouseStoryToGithubIssue = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(clubhouseStoryURL, githubRepoURL) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var _parseClubhouseStoryU, storyId, _parseGithubRepoURL, owner, repo, clubhouseUsers, clubhouseUsersById, story, unsavedIssue, unsavedIssueComments, issue;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _assertOption('githubToken', options);
            _assertOption('clubhouseToken', options);

            _parseClubhouseStoryU = (0, _urlParse.parseClubhouseStoryURL)(clubhouseStoryURL), storyId = _parseClubhouseStoryU.storyId;
            _parseGithubRepoURL = (0, _urlParse.parseGithubRepoURL)(githubRepoURL), owner = _parseGithubRepoURL.owner, repo = _parseGithubRepoURL.repo;
            _context.next = 6;
            return (0, _clubhouse.listUsers)(options.clubhouseToken);

          case 6:
            clubhouseUsers = _context.sent;
            clubhouseUsersById = clubhouseUsers.reduce(function (acc, user) {
              acc[user.id] = user;
              return acc;
            });
            _context.next = 10;
            return (0, _clubhouse.getStory)(options.clubhouseToken, storyId);

          case 10:
            story = _context.sent;
            unsavedIssue = _storyToIssue(clubhouseStoryURL, story);
            unsavedIssueComments = _presentClubhouseComments(story.comments, clubhouseUsersById);
            _context.next = 15;
            return (0, _gitHub.createIssue)(options.githubToken, owner, repo, unsavedIssue);

          case 15:
            issue = _context.sent;
            _context.next = 18;
            return _bluebird2.default.each(unsavedIssueComments, function (comment) {
              return (0, _gitHub.createIssueComment)(options.githubToken, owner, repo, issue.number, comment);
            });

          case 18:
            return _context.abrupt('return', issue);

          case 19:
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

    var users, authorId, projects, _projects$find, projectId, _parseGithubIssueURL, owner, repo, issueNumber, issue, issueComments, unsavedStory, story;

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
            _parseGithubIssueURL = (0, _urlParse.parseGithubIssueURL)(githubIssueURL), owner = _parseGithubIssueURL.owner, repo = _parseGithubIssueURL.repo, issueNumber = _parseGithubIssueURL.issueNumber;
            _context2.next = 13;
            return (0, _gitHub.getIssue)(options.githubToken, owner, repo, issueNumber);

          case 13:
            issue = _context2.sent;
            _context2.next = 16;
            return (0, _gitHub.getCommentsForIssue)(options.githubToken, owner, repo, issueNumber);

          case 16:
            issueComments = _context2.sent;
            unsavedStory = _issueToStory(authorId, projectId, issue, issueComments);
            story = (0, _clubhouse.createStory)(options.clubhouseToken, unsavedStory);
            return _context2.abrupt('return', story);

          case 20:
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

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _gitHub = require('./fetchers/gitHub');

var _clubhouse = require('./fetchers/clubhouse');

var _urlParse = require('./util/urlParse');

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

function _storyToIssue(clubhouseStoryURL, story) {
  var renderedTasks = story.tasks.map(function (task) {
    return '- [' + (task.complete ? 'x' : ' ') + '] ' + task.description;
  }).join('\n');
  var renderedTasksSection = renderedTasks.length > 0 ? '\n### Tasks\n\n' + renderedTasks : '';
  var originalStory = 'From [ch' + story.id + '](' + clubhouseStoryURL + ')';

  return {
    title: story.name,
    body: originalStory + '\n\n' + story.description + renderedTasksSection
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