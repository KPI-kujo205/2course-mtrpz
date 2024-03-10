import { readFileSync, writeFileSync } from 'fs';
import * as process from 'process';
import { TPreformattedEntry } from './types';
import minimist from 'minimist';
import * as console from 'console';

function main() {
  const pathToInputFile = getInputFilePath();
  const fileContent = readFileSync(pathToInputFile).toString();
  const html = parseMarkdown(fileContent);

  const pathToOutputFile = getOutputFilePath();

  if (!pathToOutputFile) {
    console.log(html);
    return;
  }

  const page = getPage(html);
  writeFileSync(pathToOutputFile, page);
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

function parseMarkdown(markdown: string) {
  let formattedMarkdown = markdown;
  const preformattedEntries: TPreformattedEntry[] = [];

  formattedMarkdown = replacePreformattedEntries(
    formattedMarkdown,
    preformattedEntries
  );

  formattedMarkdown = replaceOpeningAndClosingMTags(formattedMarkdown);

  console.log('formattedMarkdown', formattedMarkdown);
  formattedMarkdown = replaceParagraphs(formattedMarkdown);

  formattedMarkdown = insertPreformattedEntries(
    formattedMarkdown,
    preformattedEntries
  );

  return formattedMarkdown;
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

function replaceOpeningAndClosingMTags(markdown: string) {
  const tagsRegex = getTagsRegex('([\u0400-\u04FF]*)');

  console.log('tagsRegex', tagsRegex);
  return markdown.replaceAll(
    tagsRegex,
    (match, leftTag, content, rightTag, _offset, _string, _groups) => {
      console.log('match', match);

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

function insertPreformattedEntries(
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

function getPage(content: string) {
  return `<!DOCTYPE html><html><head><title>Document</title></head><body>${content}</body></html>`;
}

try {
  main();
} catch (e) {
  console.error(e);
  process.exit(1);
}
