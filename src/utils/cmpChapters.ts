import { Data as CI } from "../types/api/ChaptersInfo";

export function groupBy(by: "volume", array: CI[]): [number, CI[]][];
export function groupBy(by: "number", array: CI[], num: number): [number, CI[]][];
export function groupBy(by: "volume" | "number", array: CI[], num: number = 50): [number, CI[]][] {
  switch (by) {
    case "volume": {
      const volumes = new Set<number>();
      array.forEach((ch) => volumes.add(parseInt(ch.volume, 10)));

      return Array.from(volumes).map((vol) => [
        vol,
        array.filter((ch) => parseInt(ch.volume, 10) === vol).sort(sortChapters("onlyByChapters")),
      ]);
    }
    case "number": {
      const sortedChapters = array.sort(sortChapters());
      const gropedChapters: [number, CI[]][] = [];
      let len: number;

      for (let i = 0; i * num < sortedChapters.length; i++) {
        len = sortedChapters.length < i * num ? sortedChapters.length : i * num;
        gropedChapters.push([i + 1, sortedChapters.slice(i * num, len)]);
      }

      return gropedChapters;
    }
  }
}

type SortOption = "onlyByChapters";

export function sortChapters(...options: (SortOption | undefined)[]) {
  return (a: CI, b: CI) => {
    if (!options.includes("onlyByChapters")) {
      const volDiff = parseInt(a.volume, 10) - parseInt(b.volume, 10);
      if (volDiff !== 0) return volDiff;
    }

    const [, aNum, aSec] = a.number.match(/(\d+)\.?(\d*)/)!;
    const [, bNum, bSec] = b.number.match(/(\d+)\.?(\d*)/)!;
    return parseInt(aNum, 10) - parseInt(bNum, 10) || parseInt(aSec, 10) - parseInt(bSec, 10);
  };
}
