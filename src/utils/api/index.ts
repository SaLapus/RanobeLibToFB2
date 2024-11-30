import { Root as QueryResponce } from "../../types/api/QueryResponce";
import { Root as ChapterInfo } from "../../types/api/ChaptersInfo";
import { Root as Chapter } from "../../types/api/Chapter";
import { TitleInfo } from "../../types/api/Title";

import rS from "./requestSuppert";

export interface fetchedQueryTitle {
  id: number;
  rus_name: string;
  orig_name: string;
  type: string;
  status: string;
  year: string;
  slug_url: string;
  cover: {
    default: string;
    thumb: string;
  };
}

export const fetchQueryTitles = rS(async function fetchQueryTitles(
  titleQuery: string
): Promise<fetchedQueryTitle[]> {
  const res = await fetch(
    `https://api.mangalib.me/api/manga?fields[]=rate_avg&fields[]=rate&fields[]=releaseDate&q=${titleQuery}&site_id[]=3`
  );

  if (!res.ok) throw `Not OK Responce: fetchQueryTitles\nCode: ${res.status}`;

  const { data }: QueryResponce = await res.json();

  if (!data.length) return [];

  return data.map((title) => ({
    id: title.id,
    rus_name: title.rus_name,
    orig_name: title.name,
    type: title.type.label,
    status: title.status.label,
    year: title.releaseDateString,
    slug_url: title.slug_url,
    cover: {
      default: title.cover.default,
      thumb: title.cover.thumbnail,
    },
  }));
});

export const fetchTitleInfo = rS(async function fetchTitleInfo(slug_url: string) {
  const res = await fetch(
    `https://api.mangalib.me/api/manga/${slug_url}?fields[]=background&fields[]=summary&fields[]=authors&fields[]=artists`
  );

  if (!res.ok) throw `Not OK Responce: fetchTitleInfo\nCode: ${res.status}`;

  const { data }: { data: TitleInfo } = await res.json();

  return data;
});

export const fetchChaptersInfo = rS(async function fetchChaptersInfo(slug_url: string) {
  const res = await fetch(`https://api.mangalib.me/api/manga/${slug_url}/chapters`);

  if (!res.ok) throw `Not OK Responce: fetchChaptersInfo\nCode: ${res.status}`;

  const { data }: ChapterInfo = await res.json();

  return data;
});

export const fetchChapter = rS(async function fetchChapter(
  slug_url: string,
  branch_id: number = 9008,
  volume: string,
  number: string
) {
  let res: Response;
  do {
    res = await fetch(
      `https://api.mangalib.me/api/manga/${slug_url}/chapter?branch_id=${branch_id}&volume=${volume}&number=${number}`
    );
  } while (res.ok);

  const { data }: Chapter = await res.json();
  return data;
});
