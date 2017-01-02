import test from 'blue-tape'
import nock from 'nock'

import {getIssue, getCommentsForIssue} from '../gitHub'

test('fetchers/gitHub', t => {
  t.test('getIssue returns a Promise', tt => {
    tt.plan(1)

    /* eslint-disable camelcase */
    const expected = {
      url: 'https://api.github.com/repos/some-owner/some-repo/issues/1',
      id: 123,
      number: 1,
      title: 'found a bug',
      body: 'there is a bug\nin this code',
    }
    nock('https://api.github.com')
      .get('/repos/some-owner/some-repo/issues/1')
      .reply(200, JSON.stringify(expected))

    return getIssue('not-a-real-token', 'some-owner', 'some-repo', 1)
      .then(data => tt.deepEqual(data, expected))
  })

  t.test('getCommentsForIssue returns a Promise', tt => {
    tt.plan(1)

    /* eslint-disable camelcase */
    const expected = [{
      url: 'https://api.github.com/repos/some-owner/some-repo/issues/1/comments/1',
      id: 123,
      body: 'uh oh',
    }, {
      url: 'https://api.github.com/repos/some-owner/some-repo/issues/1/comments/2',
      id: 234,
      body: 'me, too',
    }]
    nock('https://api.github.com')
      .get('/repos/some-owner/some-repo/issues/1/comments')
      .reply(200, JSON.stringify(expected))

    return getCommentsForIssue('not-a-real-token', 'some-owner', 'some-repo', 1)
      .then(data => tt.deepEqual(data, expected))
  })

  t.end()
})
