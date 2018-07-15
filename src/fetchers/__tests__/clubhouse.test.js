import test from 'blue-tape'
import nock from 'nock'

import {getStory, listUsers, listProjects, createStory} from '../clubhouse'

test('fetchers/clubhouse', t => {
  t.test('getStory returns a Promise', tt => {
    tt.plan(1)

    /* eslint-disable camelcase */
    const expected = [{
      id: 123,
      comments: [{
        id: 234,
        text: 'a comment',
      }],
      tasks: [{
        id: 345,
        complete: true,
        description: 'a task',
      }],
      name: 'a name',
      description: 'a description',
    }]

    nock('https://api.clubhouse.io')
      .get('/api/v2/stories/123?token=not-a-real-token')
      .reply(200, JSON.stringify(expected))

    return getStory('not-a-real-token', 123)
      .then(data => tt.deepEqual(data, expected))
  })

  t.test('listUsers returns a Promise', tt => {
    tt.plan(1)

    /* eslint-disable camelcase */
    const expected = [{
      id: 123,
      deactivated: false,
      name: 'foo',
      username: 'foo',
    }]

    nock('https://api.clubhouse.io')
      .get('/api/v2/members?token=not-a-real-token')
      .reply(200, JSON.stringify(expected))

    return listUsers('not-a-real-token')
      .then(data => tt.deepEqual(data, expected))
  })

  t.test('listProjects returns a Promise', tt => {
    tt.plan(1)

    /* eslint-disable camelcase */
    const expected = [{
      id: 123,
      archived: false,
      name: 'foo',
      abbreviation: 'foo',
      description: 'the foo project',
      color: 'blue',
      created_at: '2016-12-31T12:30:00Z',
      updated_at: '2016-12-31T12:30:00Z',
    }]

    nock('https://api.clubhouse.io')
      .get('/api/v2/projects?token=not-a-real-token')
      .reply(200, JSON.stringify(expected))

    return listProjects('not-a-real-token')
      .then(data => tt.deepEqual(data, expected))
  })

  t.test('createStory returns a Promise', tt => {
    tt.plan(1)

    /* eslint-disable camelcase */
    const story = {
      project_id: 123,
      name: 'a new story',
      description: 'this is a fairy tale; enjoy it',
      archived: false,
      comments: [{
        id: 123,
        author_id: '00000000-1111-2222-3333-444444444444',
        text: 'a comment',
      }],
    }
    const expected = {id: 123, ...story}
    nock('https://api.clubhouse.io')
      .post('/api/v2/stories?token=not-a-real-token')
      .reply(200, JSON.stringify(expected))

    return createStory('not-a-real-token', story)
      .then(data => tt.deepEqual(data, expected))
  })

  t.end()
})
