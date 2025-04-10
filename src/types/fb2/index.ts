import { ElemOrArr } from "../toolTypes";

type ElementsContent<Element> = Element | { "#": Element[] };

export type SectionLevelMarkUpElements = Paragraph | EmptyLine | Image;
export type MarkUpElements = Paragraph | EmptyLine | Image | Style;

export interface Chapter {
  section: {
    "#": [{ title: Paragraph }, ...SectionLevelMarkUpElements[]];
  };
}

export interface Paragraph {
  p: ElementsContent<string | Style>;
}

export interface EmptyLine {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  "empty-line": {};
}
export interface Image {
  image: {
    "@l:href": `#${string}`;
  };
}

export type Style = {
  [M in "strong" | "emphasis"]?: ElemOrArr<string | Style>;
};

export interface Binary {
  "@id": string;
  "@content-type": string | undefined;
  "#": string;
}
