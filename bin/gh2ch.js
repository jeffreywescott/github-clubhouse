#!/usr/bin/env node

var path = require('path')
var parseArgs = require('minimist')

var config, githubIssueToClubhouseStory
try {
  config = require('github-clubhouse/lib/util/config')
  githubIssueToClubhouseStory = require('github-clubhouse').githubIssueToClubhouseStory
} catch (err) {
  // so that we can run during development
  config = require('../lib/util/config')
  githubIssueToClubhouseStory = require('../lib').githubIssueToClubhouseStory
}

function run() {
  var args = parseArgs(process.argv.slice(2))
  var options = _loadAndOrSaveOptions(args)
  if (args._.length !== 2) {
    console.info(_usage())
    process.exit(1)
  }

  githubIssueToClubhouseStory(args._[0], args._[1], options)
    .then(function(story) {
      console.info('Created story with ID:', story.id)
    })
    .catch(function(err) {
      console.error(err)
    })
}

function _usage() {
  return 'Usage:\n' +
    '  ' + path.basename(process.argv[1]) + ' GITHUB_ISSUE_URL CLUBHOUSE_PROJECT_NAME\n' +
    '\n' +
    'Options:\n' +
    '  --github-token=TOKEN       your GitHub API token\n' +
    '  --clubhouse-token=TOKEN    your Clubhouse API token\n' +
    '  --save-config              save configuration into ~/.github-clubhouse'
}

function _loadAndOrSaveOptions(args) {
  var options = config.loadConfig()
  if (args['github-token']) {
    options.githubToken = args['github-token']
  }
  if (args['clubhouse-token']) {
    options.clubhouseToken = args['clubhouse-token']
  }
  if (Object.keys(options).length > 0) {
    config.createConfigIfNotExists(options)
  }
  if (args['save-config']) {
    config.saveConfig(options)
  }

  return options
}

if (!module.parent) {
  run()
}
