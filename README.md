# CSE 110 Spring '21 Group 12

[Team Page](admin/team.md)

Our project will be a digital bullet journal

### Documentation Site
our jsDocs are hosted [here](https://dustinlin.github.io/110Group12JsDocs/index.html)

### How to set up eslint and prettier on VS-Code

1. run `npm install` in the root project directory (where the package.json is)
2. make sure to install the eslint extension for vscode

### Setting up auto-formating on save for js, html, and css files

TODO: For some reason there is no syntax highlighting for html and css files, but you are able to check the files directly from the command line using `npx prettier [filename]` and format them automatically using `npx prettier --write [filename]`.

1. install the prettier extension for vscode
2. in the vscode settings, under "defualt formatter" select prettier as your default formatter
3. enable "format on save"


### Notes on style and structure for reference
We agreed to all use *camelCase* for naming, and file names will be in capital letters (eg: `YearlyOverview`)
In the `source` directory, we have folders for each page, and each folder will contain their own files. If we end up having global css properties, then perhaps we will have a stylesheet in `source/` that other pages can reference.  Use `let` instead of `var` for variables.

