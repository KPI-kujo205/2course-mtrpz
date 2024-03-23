import { readFileSync, writeFileSync } from 'fs';
import * as process from 'process';
import { TPreformattedEntry } from './types';
import minimist from 'minimist';
import * as console from 'console';

function main() {
  const pathToInputFile = getInputFilePath();
  const pathToOutputFile = getOutputFilePath();
  const fileContent = readFileSync(pathToInputFile).toString();
  let outContent: string;

  const isHtml = isParsedToHtml();

  if (isHtml) {
    outContent = parseMarkdownToHtml(fileContent);
  } else {
    outContent = parseMarkdownToANSIEscapeCodes(fileContent);
  }

  if (!pathToOutputFile) {
    console.log(outContent);
    return;
  }

  if (isHtml) {
    outContent = getHTMLPage(outContent);
  }

  writeFileSync(pathToOutputFile, outContent);
}

function getInputFilePath() {
  const args = minimist(process.argv.slice(2));

  if (args._.length === 0) {
    throw new Error('Error: no input file specified!');
  }

  if (args._.length > 1) {
    throw new Error('Error: too many input files specified!');
  }

  return args._[0] as string;
}

function isParsedToHtml() {
  const args = minimist(process.argv.slice(2));
  return !!args?.format;
}

function parseMarkdownToHtml(markdown: string) {
  let formattedMarkdown = markdown;
  const preformattedEntries: TPreformattedEntry[] = [];

  formattedMarkdown = replacePreformattedEntries(
    formattedMarkdown,
    preformattedEntries
  );

  formattedMarkdown = replaceOpeningAndClosingTags(formattedMarkdown);
  formattedMarkdown = replaceParagraphs(formattedMarkdown);
  formattedMarkdown = insertPreReplacers(
    formattedMarkdown,
    preformattedEntries
  );

  return formattedMarkdown;
}

function parseMarkdownToANSIEscapeCodes(markdown: string) {
  return markdown;
}
function replacePreformattedEntries(
  markdown: string,
  preformattedEntries: TPreformattedEntry[]
) {
  return markdown.replace(/(```+)([^`]+)\1/g, (match) => {
    preformattedEntries.push({
      index: preformattedEntries.length + 1,
      value: match,
    });
    return `@pre${preformattedEntries.length}`;
  });
}

function replaceOpeningAndClosingTags(markdown: string) {
  const tagsRegex = getTagsRegex('([\u0400-\u04FF]*)');

  return markdown.replaceAll(
    tagsRegex,
    (match, leftTag, content, rightTag, _offset, _string, _groups) => {
      if (leftTag !== rightTag) {
        throw new Error(
          `Invalid opening and closing tags or nested tags detected (${match})`
        );
      }

      if (content.match(tagsRegex))
        throw new Error(`Tag nesting is forbidden ${match}`);

      if (content.trim().length === 0)
        throw new Error(`Empty tags are forbidden ${match}`);

      return replaceTagsWithHTML(leftTag, content);
    }
  );
}

function getTagsRegex(innerContent: string) {
  const tag = '\\*\\*|_|`';
  return new RegExp(`(${tag})${innerContent}(${tag})`, 'gm');
}

function replaceTagsWithHTML(tag: string, content: string) {
  switch (tag) {
    case '**':
      return `<b>${content}</b>`;
    case '_':
      return `<i>${content}</i>`;
    case '`':
      return `<tt>${content}</tt>`;
    default:
      throw new Error(`Invalid tag: ${tag}`);
  }
}

function replaceParagraphs(markdown: string) {
  let output = '';
  const paragraphContents = markdown.split('\n');

  for (const content of paragraphContents) {
    if (content.trim().length === 0) continue;
    output += `<p>${content}</p>`;
  }

  return output;
}

function insertPreReplacers(
  markdown: string,
  preformattedEntries: TPreformattedEntry[]
) {
  let result = markdown;
  for (const entry of preformattedEntries) {
    const valueWithTag = `<pre>${entry.value.replaceAll(/`/g, '')}</pre>`;
    result = markdown.replace(new RegExp(`@pre${entry.index}`), valueWithTag);
  }
  return result;
}

function getOutputFilePath() {
  const args = minimist(process.argv.slice(2));
  return args?.out as string;
}

function getHTMLPage(content: string) {
  return `<!DOCTYPE html><html><head><title>Document</title></head><body>${content}</body></html>`;
}

try {
  main();
} catch (e) {
  console.error(e);
  process.exit(1);
}
