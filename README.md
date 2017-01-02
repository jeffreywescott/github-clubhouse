# github-clubhouse

[![Code Climate GPA]()
[![Code Climate Issue Count]()
[![Test Coverage]()

Import GitHub issues as stories in [Clubhouse][clubhouse].

This module functions both as a library as well as a command-line tool.


## Getting Started

1. Install the module in your project, or globally:

        $ npm install --save github-clubhouse-import
        $ # ... OR ...
        $ npm install -g github-clubhouse-import

## Using the Command-line Interface (CLI)

1. Learn about how to use the CLI:

        $ gh2ch --help

2. Import an issue:

        $ gh2ch --github-token <GH-TOKEN> --clubhouse-token <CH-TOKEN> https://github.com/myorg/myrepo/issues/1 myproject


### Configuration

If, when you run the command, no `~/.github-clubhouse` file exists, one will be created for you. It will save your GitHub and Clubhouse API tokens so that you don't have to re-type them every time. The file is in `JSON` format, so you can edit it by hand or pre-create it yourself if you so choose. For example:

```json
{
  "githubToken": "aaaaaaaabbbbbbbbccccccccddddddddeeeeeeee",
  "clubhouseToken": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
}
```

## Usage

The library exports:

### `githubIssueToClubhouseStory`

**Returns:** Promise

**Parameters:**

- `githubIssueURL` (String): the GitHub issue URL
- `clubhouseProject` (String): the Clubhouse project name into which to import the issue
- `options` (Object):
  - `githubToken` (String): the GitHub API token
  - `clubhouseToken` (String): the Clubhouse API token


## Contributing

Read the [instructions for contributing](./.github/CONTRIBUTING.md).

1. Clone the repository.

2. Run the setup tasks:

        $ npm install
        $ npm test


## License

See the [LICENSE](./LICENSE) file.


[clubhouse]: https://clubhouse.io
