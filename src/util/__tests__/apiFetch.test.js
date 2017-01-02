import test from 'blue-tape'
import nock from 'nock'

import {apiFetch, apiFetchAllPages} from '../apiFetch'

test('util/apiFetch', t => {
  t.test('apiFetch', tt => {
    tt.test('throws an APIError if unsuccessful', ttt => {
      ttt.plan(2)

      nock('https://api.example.com')
        .get('/some/path')
        .reply(401, 'Not Authorized')
        .get('/some/other/path')
        .reply(500, 'Internal Server Error')

      return Promise.all([
        ttt.shouldFail(apiFetch('https://api.example.com/some/path')),
        ttt.shouldFail(apiFetch('https://api.example.com/some/other/path')),
      ])
    })

    tt.test('returns a Promise of data if successful', tt => {
      tt.plan(1)

      const expectedResults = [
        {title: 'first'},
        {title: 'second'},
      ]
      nock('https://api.example.com')
        .get('/yet/another/path')
        .reply(200, JSON.stringify(expectedResults))

      return apiFetch('https://api.example.com/yet/another/path')
        .then(data => tt.deepEqual(data, expectedResults))
    })

    tt.end()
  })

  t.test('apiFetchAllPages', tt => {
    tt.test('returns a Promise of all pages of data if successful', ttt => {
      ttt.plan(1)

      const page1Data = [
        {title: 'first'},
        {title: 'second'},
      ]
      const page2Data = [
        {title: 'third'},
        {title: 'fourth'},
      ]
      const page3Data = [
        {title: 'fifth'},
        {title: 'sixth'},
      ]
      const expectedResults = page1Data.concat(page2Data).concat(page3Data)

      nock('https://api.example.com')
        .get('/yet/another/path')
        .reply(200, JSON.stringify(page1Data), {
          Link: '<https://api.example.com/yet/another/path?page=2>; rel="next", <https://api.example.com/yet/another/path?page=3>; rel="last"'
        })
        .get('/yet/another/path?page=2')
        .reply(200, JSON.stringify(page2Data), {
          Link: '<https://api.example.com/yet/another/path?page=3>; rel="next", <https://api.example.com/yet/another/path?page=3>; rel="last"'
        })
        .get('/yet/another/path?page=3')
        .reply(200, JSON.stringify(page3Data), {
          Link: '<https://api.example.com/yet/another/path?page=3>; rel="last"'
        })

      return apiFetchAllPages('https://api.example.com/yet/another/path')
        .then(data => ttt.deepEqual(data, expectedResults))
    })

    tt.end()
  })

  t.end()
})
