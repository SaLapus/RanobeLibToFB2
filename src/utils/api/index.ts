import { Root as Chapter } from "../../types/api/Chapter";
import { Root as ChapterInfo } from "../../types/api/ChaptersInfo";
import { Root as QueryResponce } from "../../types/api/QueryResponce";
import { TitleInfo } from "../../types/api/Title";

import rS from "./requestSupport";

export interface FetchedQueryTitle {
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
): Promise<FetchedQueryTitle[]> {
  const res = await fetch(
    `https://api.mangalib.me/api/manga?fields[]=rate_avg&fields[]=rate&fields[]=releaseDate&q=${titleQuery}&site_id[]=3`
  );

  if (!res.ok) throw `Not OK Responce: fetchQueryTitles\nCode: ${res.status}`;

  const { data } = (await res.json()) as QueryResponce;

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

export const fetchTitleInfo = rS(async function fetchTitleInfo(
  slug_url: string
) {
  const res = await fetch(
    `https://api.mangalib.me/api/manga/${slug_url}?fields[]=background&fields[]=summary&fields[]=authors&fields[]=artists`
  );

  if (!res.ok) throw `Not OK Responce: fetchTitleInfo\nCode: ${res.status}`;

  const { data } = (await res.json()) as { data: TitleInfo };

  return data;
});

export const fetchChaptersInfo = rS(async function fetchChaptersInfo(
  slug_url: string
) {
  const res = await fetch(
    `https://api.mangalib.me/api/manga/${slug_url}/chapters`
  );

  if (!res.ok) throw `Not OK Responce: fetchChaptersInfo\nCode: ${res.status}`;

  const { data } = (await res.json()) as ChapterInfo;

  return data;
});

export const fetchChapter = rS(async function fetchChapter(
  slug_url: string,
  branch_id = 9008,
  volume: string,
  number: string
) {
  const res = await fetch(
    `https://api.mangalib.me/api/manga/${slug_url}/chapter?branch_id=${branch_id}&volume=${volume}&number=${number}`
  );

  if (!res.ok) throw `Not OK Responce: fetchChapter\nCode: ${res.status}`;

  const { data } = (await res.json()) as Chapter;
  return data;
});
