import Bluebird from 'bluebird'

import {getIssue, queryIssues, getCommentsForIssue, getLabelsForIssue, createIssue, createIssueComment} from './fetchers/gitHub'
import {getStory, listUsers, listProjects, listWorkflows, createStory} from './fetchers/clubhouse'
import {parseClubhouseStoryURL, parseGithubRepoURL} from './util/urlParse'
import {log, logAppend} from './util/logging'

export {saveConfig, loadConfig} from './util/config'

export async function clubhouseStoryToGithubIssue(clubhouseStoryURL, githubRepoURL, options = {}) {
  _assertOption('githubToken', options)
  _assertOption('clubhouseToken', options)

  const {storyId} = parseClubhouseStoryURL(clubhouseStoryURL)
  const {owner, repo} = parseGithubRepoURL(githubRepoURL)

  const clubhouseUsers = await listUsers(options.clubhouseToken)
  const clubhouseUsersById = clubhouseUsers.reduce((acc, user) => {
    acc[user.id.toLowerCase()] = user
    return acc
  })

  const story = await getStory(options.clubhouseToken, storyId)
  const unsavedIssue = _storyToIssue(clubhouseStoryURL, story)
  const unsavedIssueComments = _presentClubhouseComments(story.comments, clubhouseUsersById)
  const issue = await createIssue(options.githubToken, owner, repo, unsavedIssue)
  await Bluebird.each(unsavedIssueComments, comment => createIssueComment(options.githubToken, owner, repo, issue.number, comment))

  return issue
}

export async function githubIssueToClubhouseStory(options) {
  _assertOption('githubToken', options)
  _assertOption('clubhouseToken', options)
  _assertOption('clubhouseProject', options)
  _assertOption('githubRepo', options)

  const userMappings = JSON.parse(options.userMap)

  log('Fetch Clubhouse users')
  const clubhouseUsers = await listUsers(options.clubhouseToken)
  // log("clubhouseUsers", clubhouseUsers)
  const clubhouseUsersByName = clubhouseUsers.reduce((acc, user) => {
    acc[user.profile.mention_name.toLowerCase()] = user
    return acc
  }, {})
  // log("clubhouseUsersByName", clubhouseUsersByName)

  log('Fetch Clubhouse workflows')
  // simply use the first 'unstarted' and 'done' states of the first workflow
  const clubhouseWorkflows = await listWorkflows(options.clubhouseToken)
  // log("clubhouseWorkflows", clubhouseWorkflows)
  const stateId = {open: clubhouseWorkflows[0].states.find(state => state.type === 'unstarted').id,
    done: clubhouseWorkflows[0].states.find(state => state.type === 'done').id}
  // log("stateId", stateId)

  log('Fetch Clubhouse projects')
  const projects = await listProjects(options.clubhouseToken)
  const project = projects.find(project => project.name === options.clubhouseProject)

  if (!project) {
    throw new Error(`The '${options.clubhouseProject}' project wasn't found in your Clubhouse`)
  }

  const {id: projectId} = project

  const [owner, repo] = options.githubRepo.split('/')

  let issues = []
  if ('issue' in options) {
    log('Fetch GitHub issue')
    issues = [await getIssue(options.githubToken, owner, repo, options.issue)]
  } else {
    log('Fetch GitHub issues')
    const resp = await queryIssues(options.githubToken, owner, repo, options.query)

    if (Array.isArray(resp)) {
      for (const slice of resp) {
        issues = issues.concat(slice.items)
      }
      // log("combined slices")
    } else {
      issues = resp.items
      // log("one result set")
    }
  }
  log('GitHub issues to import: ', issues.length)

  let count = 0
  for (const issue of issues) {
    // log("issue", issue)
    log(`GitHub #${issue.number} --> `)
    const issueComments = await getCommentsForIssue(options.githubToken, owner, repo, issue.number)
    const issueLabels = await getLabelsForIssue(options.githubToken, owner, repo, issue.number)
    // log("comments", issueComments)
    // log("labels", issueLabels)
    const unsavedStory = _issueToStory(clubhouseUsersByName, projectId, stateId, issue, issueComments, issueLabels, userMappings)
    // log("story", unsavedStory)

    if (!options.dryRun) {
      const story = await createStory(options.clubhouseToken, unsavedStory)
      logAppend(`Clubhouse #${story.id} ${story.name}`)
      count += 1
    } else {
      logAppend('Not creating story for: ', issue.title)
    }
  }

  return count
}

function _assertOption(name, options) {
  if (!options[name]) {
    throw new Error(`${name} option must be provided`)
  }
}

function _mapUser(clubhouseUsersByName, githubUsername, userMappings) {
  // log("githubUsername", githubUsername)

  // make comparison lower case
  githubUsername = githubUsername.toLowerCase()

  let username
  if (githubUsername in userMappings) {
    username = userMappings[githubUsername]
  } else {
    username = githubUsername
  }

  // log("username-mapping:", githubUsername, "->", username)
  if (clubhouseUsersByName[username]) {
    return clubhouseUsersByName[username].id
  }

    // username not found
    // log("Warning, user missing from Clubhouse:", username)
    // log("Object.keys(clubhouseUsersByName)", Object.keys(clubhouseUsersByName))

    // '*' can be used to define the default username
  if ('*' in userMappings && userMappings['*'] in clubhouseUsersByName) {
    username = userMappings['*']
  } else {
      // othwerwise just pick the first one...
    username = Object.keys(clubhouseUsersByName)[0]
  }

  return clubhouseUsersByName[username].id
}

/* eslint-disable camelcase */

function _issueToStory(clubhouseUsersByName, projectId, stateId, issue, issueComments, issueLabels, userMappings) {
  const story = {
    project_id: projectId,
    name: issue.title,
    description: (issue.body !== null) ? issue.body : '',
    comments: _presentGithubComments(clubhouseUsersByName, issueComments, userMappings),
    labels: _presentGithubLabels(issueLabels),
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    external_id: issue.html_url,
    requested_by_id: _mapUser(clubhouseUsersByName, issue.user.login, userMappings),
  }

  if (issue.assignee !== null) {
    story.owner_ids = [_mapUser(clubhouseUsersByName, issue.assignee.login, userMappings)]
  }

  if (issue.state === 'closed') {
    story.workflow_state_id = stateId.done
    story.completed_at_override = issue.closed_at
  }

  return story
}

function _presentGithubComments(clubhouseUsersByName, issueComments, userMappings) {
  return issueComments.map(issueComment => ({
    author_id: _mapUser(clubhouseUsersByName, issueComment.user.login, userMappings),
    text: issueComment.body,
    created_at: issueComment.created_at,
    updated_at: issueComment.updated_at,
    external_id: issueComment.url,
  }))
}

function _presentGithubLabels(issueLabels) {
  return issueLabels.map(issueLabel => ({
    name: issueLabel.name,
    color: `#${issueLabel.color}`,
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
