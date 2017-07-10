'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _urlParse = require('../urlParse');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape2.default)('util/urlParse', function (t) {
  t.test('parseClubhouseStoryURL', function (tt) {
    tt.test('throws an error if the URL is not a Clubhouse story URL', function (ttt) {
      ttt.plan(1);
      ttt.throws(function () {
        return (0, _urlParse.parseClubhouseStoryURL)('https://example.com/a/b/123/c-d-e');
      });
    });

    tt.test('extracts orgSlug and storyId from Clubhouse story URLs', function (ttt) {
      ttt.plan(1);

      var parsed = (0, _urlParse.parseClubhouseStoryURL)('https://app.clubhouse.io/org/story/123/some-slug-here');
      ttt.deepEqual(parsed, {
        orgSlug: 'org',
        storyId: 123
      });
    });

    tt.end();
  });

  t.test('parseGithubIssueURL', function (tt) {
    tt.test('throws an error if the URL is not a GitHub issue URL', function (ttt) {
      ttt.plan(1);
      ttt.throws(function () {
        return (0, _urlParse.parseGithubIssueURL)('https://example.com/a/b/c/123');
      });
    });

    tt.test('extracts owner, repo, and issueNumber from GitHub issue URLs', function (ttt) {
      ttt.plan(1);

      var parsed = (0, _urlParse.parseGithubIssueURL)('https://github.com/owner/repo/issues/123');
      ttt.deepEqual(parsed, {
        owner: 'owner',
        repo: 'repo',
        issueNumber: 123
      });
    });

    tt.end();
  });

  t.test('parseGithubRepoURL', function (tt) {
    tt.test('throws an error if the URL is not a GitHub repo URL', function (ttt) {
      ttt.plan(1);
      ttt.throws(function () {
        return (0, _urlParse.parseGithubRepoURL)('https://example.com/a/b');
      });
    });

    tt.test('extracts owner, repo, and issueNumber from GitHub issue URLs', function (ttt) {
      ttt.plan(1);

      var parsed = (0, _urlParse.parseGithubRepoURL)('https://github.com/owner/repo');
      ttt.deepEqual(parsed, {
        owner: 'owner',
        repo: 'repo'
      });
    });

    tt.end();
  });

  t.end();
});