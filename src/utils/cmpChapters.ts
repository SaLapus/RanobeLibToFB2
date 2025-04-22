import { Chapter } from "../hooks/state/state";

export function groupBy(
  by: "volume",
  dict: Record<number, Chapter>
): Record<string, Chapter[]>;
export function groupBy(
  by: "number",
  dict: Record<number, Chapter>,
  num: number
): Record<string, Chapter[]>;
export function groupBy(
  by: "volume" | "number",
  dict: Record<number, Chapter>,
  num = 50
): Record<string, Chapter[]> {
  switch (by) {
    case "volume": {
      const volumes: Record<string, Chapter[]> = {};
      Object.values(dict).forEach((chapter) => {
        if (!volumes[chapter.volume]) volumes[chapter.volume] = [];
        volumes[chapter.volume].push(chapter);
      });

      Object.values(volumes).forEach((volume) => volume.sort(sortChapters()));

      return volumes;
    }
    case "number": {
      return Object.values(dict)
        .reduce<Chapter[][]>((volumes, chapter, i) => {
          const volumeId = Math.floor(i / num);

          if (!volumes[volumeId]) volumes[volumeId] = [];
          volumes[volumeId].push(chapter);

          return volumes;
        }, [])
        .map((volume) => volume.sort(sortChapters()))
        .reduce<Record<string, Chapter[]>>((volumes, volume, i) => {
          volumes[i] = volume;
          return volumes;
        }, {});
    }
  }
}

export function sortChapters() {
  return (a: Chapter, b: Chapter) => {
    const volDiff = a.volumeID - b.volumeID;
    if (volDiff !== 0) return volDiff;

    return (
      a.chapterFirstID - b.chapterFirstID ||
      (a.chapterSecondID && b.chapterSecondID
        ? a.chapterSecondID - b.chapterSecondID
        : 0)
    );
  };
}
