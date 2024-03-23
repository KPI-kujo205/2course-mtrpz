import { describe, expect, test } from '@jest/globals';
import { parseMarkdownToHtml } from '../src/src';

describe('Tags replacement', () => {
  test('Code block tag replacement', () => {
    const inputMarkdown = '```markdown\n**Not replaced**\n_This as well_\n```';
    const outputMarkdown =
      '<p><pre>markdown\n**Not replaced**\n_This as well_\n</pre></p>';
    expect(parseMarkdownToHtml(inputMarkdown)).toBe(outputMarkdown);
  });

  test('Bolded tag replacement', () => {
    const inputMarkdown = '**bolded text**';
    const outputMarkdown = '<p><b>bolded text</b></p>';
    expect(parseMarkdownToHtml(inputMarkdown)).toBe(outputMarkdown);
  });

  test('Cursive tag replacement', () => {
    const inputMarkdown = '_cursive text_';
    const outputMarkdown = '<p><i>cursive text</i></p>';
    expect(parseMarkdownToHtml(inputMarkdown)).toBe(outputMarkdown);
  });

  test('Monospace tag replacement', () => {
    const inputMarkdown = '`monospace text`';
    const outputMarkdown = '<p><tt>monospace text</tt></p>';
    expect(parseMarkdownToHtml(inputMarkdown)).toBe(outputMarkdown);
  });

  //this won't work
  test('Bolded tag replacement', () => {
    const inputMarkdown = '**bolded text**';
    const outputMarkdown = '<p><fb>bolded text</fb></p>';
    expect(parseMarkdownToHtml(inputMarkdown)).toBe(outputMarkdown);
  });
});

describe('Tags replacement error cases', () => {
  test('Nested tags error', () => {
    const inputMarkdown = '**_nested tags_**';
    expect(() => parseMarkdownToHtml(inputMarkdown)).toThrowError();
  });

  test('Empty tag error', () => {
    const inputMarkdown = '_ _';
    expect(() => parseMarkdownToHtml(inputMarkdown)).toThrowError();
  });

  test('Nested not closed tags', () => {
    const inputMarkdown = '**_lol`**';
    expect(() => parseMarkdownToHtml(inputMarkdown)).toThrowError();
  });
});
