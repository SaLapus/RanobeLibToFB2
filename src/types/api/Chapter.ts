export interface Root {
  data: Data;
}

export interface Data {
  id: number;
  model: string;
  volume: string;
  number: string;
  number_secondary: string;
  name: string;
  slug: string;
  branch_id: number;
  manga_id: number;
  created_at: string;
  moderated: Moderated;
  likes_count: number;
  teams: Team[];
  type: string;
  content: string | Doc;
  attachments: Attachment[];
}

export interface Moderated {
  id: number;
  label: string;
}

export interface Team {
  id: number;
  slug: string;
  slug_url: string;
  model: string;
  name: string;
  cover: Cover;
  vk: string;
  discord: string;
}

export interface Cover {
  filename: string;
  thumbnail: string;
  default: string;
  md: string;
}

export interface Attachment {
  id: number | null;
  filename: string;
  name: string;
  extension: string;
  url: string;
  width: number;
  height: number;
}

export type ChapterObjects = Doc | Paragraph | Image | HardBrake | TextContent;
export type Content = Extract<ChapterObjects, { content: unknown }>;

export interface Doc {
  type: "doc";
  content: Array<Paragraph | Image>;
}

export interface Paragraph {
  type: "paragraph";
  content: (TextContent | HardBrake)[];
  attrs?: Attrs;
}

export interface Image {
  type: "image";
  attrs: ImageContent;
}

export interface HardBrake {
  type: "hardBreak";
}

export interface TextContent {
  type: "text";
  text: string;
  marks?: Mark[];
}

export interface Attrs {
  textAlign: "center" | "right";
}

export interface Mark {
  type: "italic" | "bold";
}
export interface ImageContent {
  description: string;
  images: Array<{
    image: string;
  }>;
}
