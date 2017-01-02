import {apiFetch, apiFetchAllPages} from '../util/apiFetch'

function headers(token) {
  return {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
  }
}

function apiURL(path) {
  return `https://api.github.com${path}`
}

export function getIssue(token, owner, repoName, issueNumber) {
  const issueUrl = apiURL(`/repos/${owner}/${repoName}/issues/${issueNumber}`)
  return apiFetch(issueUrl, {headers: headers(token)})
}

export function getCommentsForIssue(token, owner, repoName, issueNumber) {
  const commentsUrl = apiURL(`/repos/${owner}/${repoName}/issues/${issueNumber}/comments`)
  return apiFetchAllPages(commentsUrl, {headers: headers(token)})
}
