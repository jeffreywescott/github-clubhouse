# github-clubhouse

[![Code Climate GPA](https://codeclimate.com/repos/586a009bb716e3008100138b/badges/17d5efb482ed787fc530/gpa.svg)](https://codeclimate.com/repos/586a009bb716e3008100138b/feed)
[![Code Climate Issue Count](https://codeclimate.com/repos/586a009bb716e3008100138b/badges/17d5efb482ed787fc530/issue_count.svg)](https://codeclimate.com/repos/586a009bb716e3008100138b/feed)
[![Test Coverage](https://codeclimate.com/repos/586a009bb716e3008100138b/badges/17d5efb482ed787fc530/coverage.svg)](https://codeclimate.com/repos/586a009bb716e3008100138b/coverage)

Import GitHub issues as stories in [Clubhouse][clubhouse].

This module functions both as a library as well as a command-line tool.


## Getting Started

1. Install the module in your project, or globally:

        $ npm install --save github-clubhouse
        $ # ... OR ...
        $ npm install -g github-clubhouse

## Using the Command-line Interface (CLI)

1. Learn about how to use the CLI:

        $ gh2ch --help
        Usage:
          gh2ch GITHUB_ISSUE_URL CLUBHOUSE_PROJECT_NAME

        Options:
          -h, --help                 display this help message
          -s, --save-config          save configuration into ~/.github-clubhouse
          --github-token=TOKEN       your GitHub API token
          --clubhouse-token=TOKEN    your Clubhouse API token

2. Import an issue:

        $ gh2ch --save-config --github-token <GH-TOKEN> --clubhouse-token <CH-TOKEN> https://github.com/myorg/myrepo/issues/1 myproject


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

- `githubIssueURL` **(String)**: the GitHub issue URL
- `clubhouseProject` **(String)**: the Clubhouse project name into which to import the issue
- `options` **(Object)**:
  - `githubToken` **(String)**: the GitHub API token
  - `clubhouseToken` **(String)**: the Clubhouse API token


## Contributing

Read the [instructions for contributing](./.github/CONTRIBUTING.md).

1. Clone the repository.

2. Run the setup tasks:

        $ npm install
        $ npm test


## License

See the [LICENSE](./LICENSE) file.


[clubhouse]: https://clubhouse.io
