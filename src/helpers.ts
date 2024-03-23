import { TReplacerFn } from '../types';

const HTMLReplacer: TReplacerFn = (tag: string, content: string) => {
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
};

const ANSIEscapeCodesReplacer: TReplacerFn = (tag: string, content: string) => {
  switch (tag) {
    case '**':
      return `\x1b[1m${content}\x1b[0m`;
    case '_':
      return `\x1b[3m${content}\x1b[0m`;
    case '`':
      return `\x1b[7m${content}\x1b[0m`;
    default:
      throw new Error(`Invalid tag: ${tag}`);
  }
};

const wrapContantInANSIPreTag = (content: string) => {
  return `\x1b[7m${content}\x1b[0m`;
};

const wrapContantInHTMLPreTag = (content: string) => {
  return `<pre>${content}</pre>`;
};

export {
  HTMLReplacer,
  ANSIEscapeCodesReplacer,
  wrapContantInHTMLPreTag,
  wrapContantInANSIPreTag,
};
