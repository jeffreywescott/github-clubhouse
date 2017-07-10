import test from 'tape'

import {parseClubhouseStoryURL, parseGithubIssueURL, parseGithubRepoURL} from '../urlParse'

test('util/urlParse', t => {
  t.test('parseClubhouseStoryURL', tt => {
    tt.test('throws an error if the URL is not a Clubhouse story URL', ttt => {
      ttt.plan(1)
      ttt.throws(() => parseClubhouseStoryURL('https://example.com/a/b/123/c-d-e'))
    })

    tt.test('extracts orgSlug and storyId from Clubhouse story URLs', ttt => {
      ttt.plan(1)

      const parsed = parseClubhouseStoryURL('https://app.clubhouse.io/org/story/123/some-slug-here')
      ttt.deepEqual(parsed, {
        orgSlug: 'org',
        storyId: 123,
      })
    })

    tt.end()
  })

  t.test('parseGithubIssueURL', tt => {
    tt.test('throws an error if the URL is not a GitHub issue URL', ttt => {
      ttt.plan(1)
      ttt.throws(() => parseGithubIssueURL('https://example.com/a/b/c/123'))
    })

    tt.test('extracts owner, repo, and issueNumber from GitHub issue URLs', ttt => {
      ttt.plan(1)

      const parsed = parseGithubIssueURL('https://github.com/owner/repo/issues/123')
      ttt.deepEqual(parsed, {
        owner: 'owner',
        repo: 'repo',
        issueNumber: 123,
      })
    })

    tt.end()
  })

  t.test('parseGithubRepoURL', tt => {
    tt.test('throws an error if the URL is not a GitHub repo URL', ttt => {
      ttt.plan(1)
      ttt.throws(() => parseGithubRepoURL('https://example.com/a/b'))
    })

    tt.test('extracts owner, repo, and issueNumber from GitHub issue URLs', ttt => {
      ttt.plan(1)

      const parsed = parseGithubRepoURL('https://github.com/owner/repo')
      ttt.deepEqual(parsed, {
        owner: 'owner',
        repo: 'repo',
      })
    })

    tt.end()
  })

  t.end()
})
