import Bluebird from 'bluebird'

import {getIssue, getCommentsForIssue, createIssue, createIssueComment} from './fetchers/gitHub'
import {getStory, listUsers, listProjects, createStory} from './fetchers/clubhouse'
import {parseClubhouseStoryURL, parseGithubIssueURL, parseGithubRepoURL} from './util/urlParse'

export {saveConfig, loadConfig} from './util/config'

export async function clubhouseStoryToGithubIssue(clubhouseStoryURL, githubRepoURL, options = {}) {
  _assertOption('githubToken', options)
  _assertOption('clubhouseToken', options)

  const {storyId} = parseClubhouseStoryURL(clubhouseStoryURL)
  const {owner, repo} = parseGithubRepoURL(githubRepoURL)

  const clubhouseUsers = await listUsers(options.clubhouseToken)
  const clubhouseUsersById = clubhouseUsers.reduce((acc, user) => {
    acc[user.id] = user
    return acc
  })

  const story = await getStory(options.clubhouseToken, storyId)
  const unsavedIssue = _storyToIssue(clubhouseStoryURL, story)
  const unsavedIssueComments = _presentClubhouseComments(story.comments, clubhouseUsersById)
  const issue = await createIssue(options.githubToken, owner, repo, unsavedIssue)
  await Bluebird.each(unsavedIssueComments, comment => createIssueComment(options.githubToken, owner, repo, issue.number, comment))

  return issue
}

export async function githubIssueToClubhouseStory(githubIssueURL, clubhouseProject, options = {}) {
  _assertOption('githubToken', options)
  _assertOption('clubhouseToken', options)

  const users = await listUsers(options.clubhouseToken)
  const {id: authorId} = users[0]

  const projects = await listProjects(options.clubhouseToken)
  const {id: projectId} = projects.find(project => project.name === clubhouseProject)

  const {owner, repo, issueNumber} = parseGithubIssueURL(githubIssueURL)
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
    comments: _presentGithubComments(authorId, issueComments),
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    external_id: issue.url,
  }
}

function _presentGithubComments(authorId, issueComments) {
  return issueComments.map(issueComment => ({
    author_id: authorId,
    text: `**[Comment from GitHub user @${issueComment.user.login}:]** ${issueComment.body}`,
    created_at: issueComment.created_at,
    updated_at: issueComment.updated_at,
    external_id: issueComment.url,
  }))
}

function _storyToIssue(clubhouseStoryURL, story) {
  const renderedTasks = story.tasks
    .map(task => `- [${task.complete ? 'x' : ' '}] ${task.description}`)
    .join('\n')
  const renderedTasksSection = renderedTasks.length > 0 ? `\n### Tasks\n\n${renderedTasks}` : ''
  const originalStory = `From [ch${story.id}](${clubhouseStoryURL})`

  return {
    title: story.name,
    body: `${originalStory}\n\n${story.description}${renderedTasksSection}`,
  }
}

function _presentClubhouseComments(comments, clubhouseUsersById) {
  return comments.map(comment => {
    const user = clubhouseUsersById[comment.author_id] || {username: comment.author_id}
    return {
      body: `**[Comment from Clubhouse user @${user.username}:]** ${comment.text}`
    }
  })
}
