#!/usr/bin/env node

var path = require('path')
var parseArgs = require('minimist')

var ghCh
try {
  ghCh = require('github-clubhouse')
} catch (err) {
  // so that we can run during development
  ghCh = require('../lib')
}
var loadConfig = ghCh.loadConfig
var saveConfig = ghCh.saveConfig
var clubhouseStoryToGithubIssue = ghCh.clubhouseStoryToGithubIssue

function run() {
  var args = parseArgs(process.argv.slice(2), {
    string: ['github-token', 'clubhouse-token'],
    boolean: ['s', 'h'],
    alias: {
      h: 'help',
      s: 'save-config',
    },
  })
  if (args.h) {
    console.info(_usage())
    return process.exit(0)
  }
  if (args._.length !== 2) {
    return _die('CLUBHOUSE_STORY_URL and GITHUB_REPO_URL are both required.')
  }

  var options = _loadAndOrSaveOptions(args)

  clubhouseStoryToGithubIssue(args._[0], args._[1], options)
    .then(function(issue) {
      /* eslint-disable camelcase */
      console.info('Created github issue:', issue.html_url)
    })
    .catch(function(err) {
      console.error(err)
    })
}

function _die(message) {
  console.error(`ERROR: ${message}`)
  console.error('Try `--help` for help.')
  process.exit(1)
}

function _usage() {
  return 'Usage:\n' +
    '  ' + path.basename(process.argv[1]) + ' CLUBHOUSE_STORY_URL GITHUB_REPO_URL\n' +
    '\n' +
    'Options:\n' +
    '  -h, --help                 display this help message\n' +
    '  -s, --save-config          save configuration into ~/.github-clubhouse\n' +
    '  --github-token=TOKEN       your GitHub API token\n' +
    '  --clubhouse-token=TOKEN    your Clubhouse API token'
}

function _loadAndOrSaveOptions(args) {
  var options = loadConfig()
  if (args['github-token']) {
    options.githubToken = args['github-token']
  }
  if (args['clubhouse-token']) {
    options.clubhouseToken = args['clubhouse-token']
  }
  if (args.s) {
    if (!args['github-token'] || !args['clubhouse-token']) {
      return _die('Cannot save configuration unless both `--github-token` and `--clubhouse-token` are provided.')
    }
    saveConfig(options)
  }

  return options
}

if (!module.parent) {
  run()
}
