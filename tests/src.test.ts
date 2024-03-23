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
});
