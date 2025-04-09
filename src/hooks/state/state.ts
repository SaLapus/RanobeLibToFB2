import type { } from "@redux-devtools/extension"; // required for devtools typing\
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { fetchChaptersInfo, fetchTitleInfo } from "../../utils/api";

import type { Data as ChapterInfo } from "../../types/api/ChaptersInfo";
import type { TitleInfo } from "../../types/api/Title";

interface InfoState {
  slug: string | undefined;
  setSlug: (slug: string) => Promise<void>;

  titleInfo?: TitleInfo;
  chaptersInfo?: ChapterInfo[];
}

// Set Id для быстрого поиска
interface ChoosedChaptersState {
  chapters: Map<number, ChapterInfo[]>;
  ids: Set<number>;
  addChapters: (chapters: [number, chapters: ChapterInfo[]][]) => void;
  toggleChapter: (id: number, chapters: ChapterInfo) => void;
  deleteChapters: (id?: number) => void;
  hasChapter: (id: number) => boolean;
}

const useInfoStore = create<InfoState>()(
  // devtools()
  (set) => ({
    slug: undefined,
    setSlug: async (slug) => {
      console.log("Setting slug");

      try {
        const [title, chapters] = await Promise.all([
          fetchTitleInfo(slug),
          fetchChaptersInfo(slug),
        ]);

        console.log("Title fetched");

        set({ titleInfo: title, chaptersInfo: chapters, slug });
      } catch (error) {
        console.error("Error fetching data:", error);
        set({ slug });
      }
    },
  })
);

const useChapterStore = create<ChoosedChaptersState>()(
  devtools((set, get) => ({
    chapters: new Map(),
    ids: new Set(),
    addChapters: (chapters: [number, chapters: ChapterInfo[]][]) => {
      set({
        chapters: new Map(chapters),
        ids: new Set(
          chapters.flatMap(([, val]) => val.map((chapter) => chapter.id))
        ),
      });
    },
    toggleChapter: (vol, chapter) => {
      const newState = new Map(get().chapters);

      if (
        [...newState.values()]
          .flatMap((val) => val.map((chapter) => chapter.id))
          .find((id) => id === chapter.id)
      )
        newState.delete(vol);
      else if (newState.has(vol)) newState.get(vol)?.push(chapter);
      else newState.set(vol, [chapter]);

      set({
        chapters: newState,
        ids: new Set(
          [...newState.values()].flatMap((val) =>
            val.map((chapter) => chapter.id)
          )
        ),
      });
    },
    deleteChapters: (id) => {
      const newState = new Map(get().chapters);

      if (!id) set({ chapters: new Map(), ids: new Set() });
      else {
        newState.delete(id);

        set({
          chapters: newState,
          ids: new Set(
            [...newState.values()].flatMap((val) =>
              val.map((chapter) => chapter.id)
            )
          ),
        });
      }
    },
    hasChapter: (id) => get().ids.has(id),
  }))
);

export { useChapterStore, useInfoStore };

