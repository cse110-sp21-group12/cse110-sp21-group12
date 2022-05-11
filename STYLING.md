This document contains some notes on styling practice

**It is important to `npm install` the development packages**

Our styling checks are enforced currently *on push* to github via github actions. This will soon change to checking *on commit* locally via husky.

The pipeline (as of 5/11) additionally checks for git branch naming format as well as commit message formats

**Code styling** - enforced by prettier, these are the current rules from `.pretterrc.js`:
```
    trailingComma: 'es5',
    semi: true,
    singleQuote: true,
    printWidth: 80,
    tabWidth: 4,
    endOfLine: 'auto',
```


**eslint configuration** - see `.eslintrc.json` for full details, but essentially we are using the predefined "recommended" rules, as well as adding a few custom ones that weren't defined.

These below enforce the use of having dangling commas, semi quotes, use of single quotes, and camcelcase for naming.
```
        "comma-dangle": ["error","only-multiline"],
        "semi": ["error","always"],
        "quotes": ["error", "single"],
        "camelcase": ["error"]
```

Branch formatting guidelines:
the regular expression checking branch guidelines want the following format: "NL-[issue number from github]_[some description of issue *in camcelcase*]-[names of ppl working on it]"

note that multiple people on a branch should be separated by an underscore "_"

eg: "NL-2_testIssue-Dustin_Shawn"

### recommendations
installing the prettier and eslint plugins on vscode are nice to get you live error feedback:w
