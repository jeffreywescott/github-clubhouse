import fetch from 'node-fetch'
import parseLinkHeader from 'parse-link-header'

const DEFAULT_HEADERS = {
  Accept: 'application/json',
}

class APIError extends Error {
  constructor(status, statusText, url) {
    const message = `API Error ${status} (${statusText}) trying to invoke API (url = '${url}')`
    super(message)
    this.name = 'APIError'
    this.status = status
    this.statusText = statusText
    this.url = url
  }
}

function apiFetchRaw(url, opts = {}) {
  const headers = Object.assign({}, DEFAULT_HEADERS, opts.headers)
  const options = Object.assign({}, opts, {headers})
  return fetch(url, options)
}

export function apiFetch(url, opts = {}) {
  return apiFetchRaw(url, opts)
    .then(resp => {
      if (!resp.ok) {
        throw new APIError(resp.status, resp.statusText, url)
      }
      return resp.json()
    })
}

export function apiFetchAllPages(url, opts = {}, prevResults = []) {
  return apiFetchRaw(url, opts)
    .then(resp => {
      if (!resp.ok) {
        throw new APIError(resp.status, resp.statusText, url)
      }
      const link = parseLinkHeader(resp.headers.get('Link'))
      let next = null
      if (link && link.next) {
        next = link.next.results && !eval(link.next.results) ? null : link.next.url // eslint-disable-line no-eval
      }
      return resp.json()
        .then(results => {
          if (next) {
            return apiFetchAllPages(next, opts, prevResults.concat(results))
          }
          return prevResults.concat(results)
        })
    })
}
