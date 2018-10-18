# github-clubhouse

[![Code Climate GPA](https://codeclimate.com/repos/586a009bb716e3008100138b/badges/17d5efb482ed787fc530/gpa.svg)](https://codeclimate.com/repos/586a009bb716e3008100138b/feed)
[![Code Climate Issue Count](https://codeclimate.com/repos/586a009bb716e3008100138b/badges/17d5efb482ed787fc530/issue_count.svg)](https://codeclimate.com/repos/586a009bb716e3008100138b/feed)
[![Test Coverage](https://codeclimate.com/repos/586a009bb716e3008100138b/badges/17d5efb482ed787fc530/coverage.svg)](https://codeclimate.com/repos/586a009bb716e3008100138b/coverage)

Import GitHub issues as stories in [Clubhouse][clubhouse].

This module functions both as a library as well as a command-line tool.


## Getting Started

1. Install the module in your project, or globally:
```
  $ npm install --save github-clubhouse
  $ # ... OR ...
  $ npm install -g github-clubhouse
```

## Using the Command-line Interface (CLI)

1. Learn about how to use the CLI:

```
  Usage:
    gh2ch.js [OPTIONS]

  Options:
    -h, --help                     display this help message
    -n, --dry-run                  test run, do not import
    -s, --save-config              save configuration into ~/.github-clubhouse
    --issue=NUMBER                 GitHub issue number
    --query=QUERY                  GitHub issue query
                                       e.g. "state:closed created:>2017"
    --github-token=TOKEN           your GitHub API token
    --clubhouse-token=TOKEN        your Clubhouse API token
    --github-project=REPO/PROJECT  your GitHub repo/project name
    --clubhouse-project=PROJECT    your Clubhouse project name
    --user-map=JSON-USER_MAP       json object of gh-user:clubhouse-user mappings
                                       use "*" for default
                                       e.g. '{"my_gh_id":"my_ch_id", "*":"default_id"}'

  $ ch2gh --help
  Usage:
    ch2gh CLUBHOUSE_STORY_NUMBER GITHUB_REPO_URL

  Options:
    -h, --help                 display this help message
    -s, --save-config          save configuration into ~/.github-clubhouse
    --github-token=TOKEN       your GitHub API token
    --clubhouse-token=TOKEN    your Clubhouse API token
```

2. Import from GitHub into Clubhouse:
```
   # a single issue
   $ gh2ch.js --github-project <owner>/<repo> --clubhouse-project testing --issue 2950
   #
   # multiple issues
   $ gh2ch.js --github-project <owner>/<repo> --clubhouse-project testing --query "state:open label:bug"
```

3. Export a story from Clubhouse to GitHub:
```
   $ ch2gh --save-config --github-token <GH-TOKEN> --clubhouse-token <CH-TOKEN> 234 https://github.com/myorg/myrepo
```

### Configuration

You can avoid having to type long API tokens by creating a `~/.github-clubhouse` file. The easiest way to create the file is to pass the `-s` / `--save-config` option along with your tokens the first time you run the command. However, the file is in `JSON` format, so you can edit it by hand or pre-create it yourself if you so choose. For example:

```json
{
  "githubToken": "aaaaaaaabbbbbbbbccccccccddddddddeeeeeeee",
  "clubhouseToken": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
}
```

## Usage

The library exports:

### `githubIssueToClubhouseStory`

**Returns:** **(Promise for Object)**: the story data as created

**Parameters:**

- `options` **(Object)**:
  - `githubToken` **(String)**: the GitHub API token
  - `clubhouseToken` **(String)**: the Clubhouse API token
  - `githubRepo` **(String)**: the GitHub repository (owner/repo)
  - `clubhouseProject` **(String)**: the Clubhouse project name into which to import the issue

### `clubhouseStoryToGithubIssue`

**Returns:** **(Promise for Object)**: the issue data as created

**Parameters:**

- `clubhouseStoryId` **(Number)**: the Clubhouse story ID
- `githubRepoURL` **(String)**: the repository URL on GitHub where the issue should be created
- `options` **(Object)**:
  - `githubToken` **(String)**: the GitHub API token
  - `clubhouseToken` **(String)**: the Clubhouse API token

## Contributing

Read the [instructions for contributing](./.github/CONTRIBUTING.md).

1. Clone the repository.

2. Get your `NPM_AUTH_TOKEN` from https://npm.com and `export` it in your shell.

3. Run the setup tasks:

        $ npm install
        $ npm test


## License

See the [LICENSE](./LICENSE) file.


[clubhouse]: https://clubhouse.io
