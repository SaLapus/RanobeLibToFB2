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

export type AllNodes =
  | Doc
  | Paragraph
  | Heading
  | Image
  | HardBrake
  | TextContent;
export type TopLevelNodes = Doc | Paragraph | Image | Heading;
export type ContentLike = Extract<AllNodes, { content: unknown }>;

export interface Doc {
  type: "doc";
  content: (Paragraph | Image | Heading)[];
}

export interface Paragraph {
  type: "paragraph";
  content: (TextContent | HardBrake)[];
  attrs?: Attrs;
}

export interface Heading {
  type: "heading";
  content?: TextContent[];
  attrs: {
    level: 1 | 2 | 3 | 4 | 5;
  };
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
  images: {
    image: string;
  }[];
}
