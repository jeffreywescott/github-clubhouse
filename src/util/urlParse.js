import url from 'url'

export function parseClubhouseStoryURL(clubhouseStoryURL) {
  const {hostname, pathname} = url.parse(clubhouseStoryURL)
  if (hostname !== 'app.clubhouse.io') {
    throw new Error(`${clubhouseStoryURL} is not a valid Clubhouse story URL`)
  }

  const pathParts = pathname.split('/')
  const orgSlug = pathParts[1]
  const storyId = parseInt(pathParts[3], 10)
  if (!orgSlug.length > 0 || !storyId > 0) {
    throw new Error(`${clubhouseStoryURL} is not a valid Clubhouse story URL`)
  }
  return {
    orgSlug,
    storyId,
  }
}

export function parseGithubIssueURL(githubIssueURL) {
  const {hostname, pathname} = url.parse(githubIssueURL)
  if (hostname !== 'github.com') {
    throw new Error(`${githubIssueURL} is not a valid GitHub issue URL`)
  }

  const pathParts = pathname.split('/')
  const owner = pathParts[1]
  const repo = pathParts[2]
  const issueNumber = parseInt(pathParts[4], 10)
  if (!owner.length > 0 || !repo.length > 0 || !issueNumber > 0) {
    throw new Error(`${githubIssueURL} is not a valid GitHub issue URL`)
  }

  return {
    owner,
    repo,
    issueNumber,
  }
}

export function parseGithubRepoURL(githubRepoURL) {
  const {hostname, pathname} = url.parse(githubRepoURL)
  if (hostname !== 'github.com') {
    throw new Error(`${githubRepoURL} is not a valid GitHub repository`)
  }

  const [_, owner, repo] = pathname.split('/')
  if (!owner.length > 0 || !repo.length > 0) {
    throw new Error(`${githubRepoURL} is not a valid GitHub repository`)
  }

  return {owner, repo}
}
