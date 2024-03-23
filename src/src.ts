import { readFileSync, writeFileSync } from 'fs';
import * as process from 'process';
import {
  HTMLReplacer,
  ANSIEscapeCodesReplacer,
  wrapContantInHTMLPreTag,
  wrapContantInANSIPreTag,
} from './helpers';
import { TPreformattedEntry, TReplacerFn } from '../types';
import minimist from 'minimist';

function main() {
  const pathToInputFile = getInputFilePath();
  const pathToOutputFile = getOutputFilePath();

  const fileContent = readFileSync(pathToInputFile).toString();
  const html = parseMarkdownToHtml(fileContent);

  const formatFlag = parseFormatFlag();

  if (formatFlag === 'html') {
    process.stdout.write(html);
  } else {
    const formattedToANSI = parseMarkdownToANSIEscapeCodes(fileContent);
    process.stdout.write(formattedToANSI);
  }

  if (pathToOutputFile) {
    const htmlPage = getHTMLPage(html);
    writeFileSync(pathToOutputFile, htmlPage);
  }
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

function parseFormatFlag() {
  const possibleFormats = ['html', 'ansi'];
  const args = minimist(process.argv.slice(2));
  const format = args?.format;

  if ((typeof format === 'boolean' && format) || !format) return 'ansi';

  if (!possibleFormats.some((f) => f === format))
    throw new Error(
      `Invalid command line argument specified: --format=${format}
       Possible formats: ${possibleFormats.join(', ')}
      `
    );

  return format;
}
function parseMarkdownToHtml(markdown: string) {
  let formattedMarkdown = markdown;
  const preformattedEntries: TPreformattedEntry[] = [];

  formattedMarkdown = replacePreformattedEntries(
    formattedMarkdown,
    preformattedEntries
  );

  formattedMarkdown = replaceOpeningAndClosingTags(
    formattedMarkdown,
    HTMLReplacer
  );

  formattedMarkdown = replaceParagraphs(formattedMarkdown);
  formattedMarkdown = insertPreReplacers(
    formattedMarkdown,
    preformattedEntries,
    wrapContantInHTMLPreTag
  );

  return formattedMarkdown;
}
function parseMarkdownToANSIEscapeCodes(markdown: string) {
  let formattedMarkdown = markdown;
  const preformattedEntries: TPreformattedEntry[] = [];

  formattedMarkdown = replacePreformattedEntries(
    formattedMarkdown,
    preformattedEntries
  );

  formattedMarkdown = replaceOpeningAndClosingTags(
    formattedMarkdown,
    ANSIEscapeCodesReplacer
  );

  formattedMarkdown = insertPreReplacers(
    formattedMarkdown,
    preformattedEntries,
    wrapContantInANSIPreTag
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

function replaceOpeningAndClosingTags(
  markdown: string,
  replacerFunction: TReplacerFn
) {
  const tagsRegex = getTagsRegex('([\u0400-\u04FFA-z\\s]*)');

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

      return replacerFunction(leftTag, content);
    }
  );
}

function getTagsRegex(innerContent: string) {
  const tag = '\\*\\*|_|`';
  return new RegExp(`(${tag})${innerContent}(${tag})`, 'gm');
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
  preformattedEntries: TPreformattedEntry[],
  replacer: (arg0: string) => string
) {
  let result = markdown;
  for (const entry of preformattedEntries) {
    const valueWithoutMdTags = entry.value.replaceAll(/`/g, '');
    const valueWithTag = replacer(valueWithoutMdTags);

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

export { main, parseMarkdownToHtml };
