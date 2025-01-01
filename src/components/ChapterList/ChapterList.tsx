import { useState } from "react";
import { Data as CI } from "../../types/api/ChaptersInfo";

interface ChapterListProps {
  chaptersInfo: CI[];
}

export function ChapterList({ chaptersInfo }: ChapterListProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [checkedChapters, changeChapters] = useState<Map<number, CI>>(new Map<number, CI>());

  return (
    <div>
      {chaptersInfo
        .sort((a, b) => {
          const volDiff = parseInt(a.volume, 10) - parseInt(b.volume, 10);
          if (volDiff !== 0) return volDiff;

          const [, aNum, aSec] = a.number.match(/(\d+)\.?(\d*)/)!;
          const [, bNum, bSec] = b.number.match(/(\d+)\.?(\d*)/)!;
          return parseInt(aNum, 10) - parseInt(bNum, 10) || parseInt(aSec, 10) - parseInt(bSec, 10);
        })
        .map((ch) => {
          return (
            <div key={ch.id}>
              <span>
                <input
                  type="checkbox"
                  name=""
                  id={`chapter_${ch.id}`}
                  onChange={(e) =>
                    changeChapters((state) => {
                      if (e.target.value) state.set(ch.id, ch);
                      else state.delete(ch.id);
                      return state;
                    })
                  }
                />
              </span>
              <span>
                Том {ch.volume} Глава {ch.number}
              </span>

              <span>{ch.name ? " - " + ch.name : ""}</span>
            </div>
          );
        })}
    </div>
  );
}
