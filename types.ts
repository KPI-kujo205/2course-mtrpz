type TPreformattedEntry = {
  index: number;
  value: string;
};

type TReplacerFn = (tag: string, content: string) => string;

export type { TPreformattedEntry, TReplacerFn };
