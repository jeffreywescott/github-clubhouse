import {apiFetch} from '../util/apiFetch'

const clubhouseHeaders = {
  'Content-Type': 'application/json',
}

function apiURL(path, token) {
  return {base: 'https://api.clubhouse.io/', path: 'api/v2' + path, queryParams: {token}}
}

export function getStory(token, storyId) {
  const storyUrl = apiURL(`/stories/${storyId}`, token)
  return apiFetch(storyUrl, {headers: clubhouseHeaders})
}

export function listUsers(token) {
  const projectsUrl = apiURL('/members', token)
  return apiFetch(projectsUrl, {headers: clubhouseHeaders})
}

export function listProjects(token) {
  const projectsUrl = apiURL('/projects', token)
  return apiFetch(projectsUrl, {headers: clubhouseHeaders})
}

export function listLabels(token) {
  const projectsUrl = apiURL('/labels', token)
  return apiFetch(projectsUrl, {headers: clubhouseHeaders})
}

export function listWorkflows(token) {
  const projectsUrl = apiURL('/workflows', token)
  return apiFetch(projectsUrl, {headers: clubhouseHeaders})
}

export function createStory(token, story) {
  const storyUrl = apiURL('/stories', token)
  return apiFetch(storyUrl, {method: 'POST', headers: clubhouseHeaders, body: JSON.stringify(story)})
}

export function createLabel(token, label) {
  const labelUrl = apiURL('/labels', token)
  return apiFetch(labelUrl, {method: 'POST', headers: clubhouseHeaders, body: JSON.stringify(label)})
}
