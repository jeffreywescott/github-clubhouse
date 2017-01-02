import {apiFetch} from '../util/apiFetch'

const headers = {
  'Content-Type': 'application/json',
}

function apiURL(path, token) {
  return `https://api.clubhouse.io/api/v1${path}?token=${token}`
}

export function listUsers(token) {
  const projectsUrl = apiURL('/users', token)
  return apiFetch(projectsUrl, {headers})
}

export function listProjects(token) {
  const projectsUrl = apiURL('/projects', token)
  return apiFetch(projectsUrl, {headers})
}

export function createStory(token, story) {
  const storyUrl = apiURL('/stories', token)
  return apiFetch(storyUrl, {method: 'POST', headers, body: JSON.stringify(story)})
}
