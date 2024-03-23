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
3. Run `npm start <file-with-markdown>`

# Options
You can specify `--out` flag and a path to the file you want you save your content in

# Examples
You can use text stored in EXAMPLE.md file in order to test this parser

Enter
 
```bash
npm start EXAMPLE.md
```
and this the output in your terminal


Revert commit hash is - `11c940880847604f9349a68e8a893d4e37a53355`
