import { useShallow } from "zustand/react/shallow";

import { chaptersList } from "../../pages/Title/Title.module.css";
import { container, chapter_controls, chapter, volume } from "./ChapterList.module.css";

import { useInfoStore, useChapterStore } from "../../hooks/state/state";
import { groupBy } from "../../utils/cmpChapters";

export function ChapterList() {
  const chaptersInfo = useInfoStore((state) => state.chaptersInfo);
  const [, addChapters, toggleChapter, deleteChapters, hasChapter] = useChapterStore(
    useShallow((state) => [
      state.chapters,
      state.addChapters,
      state.toggleChapter,
      state.deleteChapters,
      state.hasChapter,
    ])
  );

  if (!chaptersInfo) return null;

  const groupedChapters = groupBy("volume", chaptersInfo);

  return (
    <div className={`${chaptersList} ${container}`}>
      <div className="controls">
        <div className={chapter_controls}>
          <span></span>
          <span>Том</span>
          <span>Глава</span>
          <span>Название</span>
        </div>

        <label htmlFor="selectAll">Выбрать все</label>
        <input
          type="checkbox"
          name=""
          id="selectAll"
          onChange={(event) => {
            if (event.target.checked) addChapters(groupedChapters);
            else deleteChapters();
          }}
        />
      </div>
      {groupedChapters.map(([vol, chs]) => (
        <div key={vol} className={volume}>
          {chs.map((ch) => {
            return (
              <div key={ch.id} className={chapter} onClick={() => toggleChapter(vol, ch)}>
                <span>
                  <input
                    type="checkbox"
                    name=""
                    id={`chapter_${ch.id}`}
                    checked={hasChapter(ch.id)}
                    onChange={() => {}}
                  />
                </span>
                <span>Том {ch.volume} </span>
                <span>Глава {ch.number} </span>
                <span>{ch.name ? " - " + ch.name : ""}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
