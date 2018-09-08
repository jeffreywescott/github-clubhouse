import {apiFetch, apiFetchAllPages} from '../util/apiFetch'

function headers(token) {
  return {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  }
}

function apiURL(path, params = {}) {
  return {base: 'https://api.github.com', path, queryParams: params}
}

export function getIssue(token, owner, repoName, issueNumber) {
  const issueUrl = apiURL(`/repos/${owner}/${repoName}/issues/${issueNumber}`)
  return apiFetch(issueUrl, {headers: headers(token)})
}

export function queryIssues(token, owner, repoName, issueQuery) {
  const issueUrl = apiURL('/search/issues', {q: issueQuery + ` repo:${owner}/${repoName} type:issue`, sort: 'created', order: 'asc'})
  return apiFetchAllPages(issueUrl, {headers: headers(token)})
}

export function getCommentsForIssue(token, owner, repoName, issueNumber) {
  const commentsUrl = apiURL(`/repos/${owner}/${repoName}/issues/${issueNumber}/comments`)
  return apiFetchAllPages(commentsUrl, {headers: headers(token)})
}

export function getLabelsForIssue(token, owner, repoName, issueNumber) {
  const labelsUrl = apiURL(`/repos/${owner}/${repoName}/issues/${issueNumber}/labels`)
  return apiFetchAllPages(labelsUrl, {headers: headers(token)})
}

export function createIssue(token, owner, repoName, issue) {
  const newIssueUrl = apiURL(`/repos/${owner}/${repoName}/issues`)
  return apiFetch(newIssueUrl, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(issue),
  })
}

export function createIssueComment(token, owner, repoName, issueNumber, comment) {
  const newCommentUrl = apiURL(`/repos/${owner}/${repoName}/issues/${issueNumber}/comments`)
  return apiFetch(newCommentUrl, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(comment),
  })
}
