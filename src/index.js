import {getIssue, getCommentsForIssue} from './fetchers/gitHub'
import {listUsers, listProjects, createStory} from './fetchers/clubhouse'

/* eslint-disable import/prefer-default-export */
export async function githubIssueToClubhouseStory(githubIssueURL, clubhouseProject, options = {}) {
  _assertOption('githubToken', options)
  _assertOption('clubhouseToken', options)

  const users = await listUsers(options.clubhouseToken)
  const {id: authorId} = users[0]

  const projects = await listProjects(options.clubhouseToken)
  const {id: projectId} = projects.find(project => project.name === clubhouseProject)

  const issueRegExp = /https?:\/\/github.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/
  const [_, owner, repo, issueNumber] = githubIssueURL.match(issueRegExp)
  const issue = await getIssue(options.githubToken, owner, repo, issueNumber)
  const issueComments = await getCommentsForIssue(options.githubToken, owner, repo, issueNumber)

  const unsavedStory = _issueToStory(authorId, projectId, issue, issueComments)
  const story = createStory(options.clubhouseToken, unsavedStory)

  return story
}

function _assertOption(name, options) {
  if (!options[name]) {
    throw new Error(`${name} option must be provided`)
  }
}

/* eslint-disable camelcase */
function _issueToStory(authorId, projectId, issue, issueComments) {
  return {
    project_id: projectId,
    name: issue.title,
    description: issue.body,
    comments: _presentComments(authorId, issueComments),
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    external_id: issue.url,
  }
}

function _presentComments(authorId, issueComments) {
  return issueComments.map(issueComment => ({
    author_id: authorId,
    text: `**[Comment from GitHub user @${issueComment.user.login}:]** ${issueComment.body}`,
    created_at: issueComment.created_at,
    updated_at: issueComment.updated_at,
    external_id: issueComment.url,
  }))
}
