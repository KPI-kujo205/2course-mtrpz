# About
This is a school project, which parses a small subset of .md to html format

The requirments are following:
- `**bold** -> <b>bold</b>` 
- `_italics_ -> <i>italics</i>`
- ``monospaced` -> <tt>monospaced</tt>`
- ` ```preformated``` -> <pre>preformatted</pre>`
- `text -> <p>text</p>`


# How to use this parser
In order to use this parser you have to:
1. Clone a repository
2. Install all the dependencies
3. Run `npm start <file-with-markdown> [options]` 
4. In order to run tests, run npm test

# Options
You can specify `--out` flag and a path to the file you want you save your content in
You can specify '--format' flag, possible values are `html` and `ansi`, this sets a format, with which the content of a parsed file will be presented in the `stdout`. 'ansi' makes the text formatted in the terminal, `html` displays text as an html in the terminal 

# Examples
You can use text stored in EXAMPLE.md file in order to test this parser

Enter
 
```bash
npm start EXAMPLE.md
```
and this the output in your terminal

# Commits
Revert commit hash is - [11c940880847604f9349a68e8a893d4e37a53355](https://github.com/KPI-kujo205/2course-mtrpz/commit/9cf6d00a15fbb1548f0f66d5706947de5666c61b)

Commit hash, which failed the ci-cd pipeline - [8aff8edb67f2248840a34dfb168e0348353e7e72](https://github.com/KPI-kujo205/2course-mtrpz/actions/runs/8401909135/job/23010773229)

# Conclusions
What can I say? Unit tests is a very important aspect of a good software, unit tests make programmer sure that the change they makes to the code won't brake the whole codebase. UNIT test are integral part of TDD, promoted by such a legend as Uncle Bob. Moreover, unit test should be written before the actual software is written. Unit test help one to test a single unit of their code. WRITE UNIT TEST NOW, don't postpone! 

