import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing\

import { fetchChaptersInfo, fetchTitleInfo } from "../../utils/api";

import { TitleInfo } from "../../types/api/Title";
import { Data as ChapterInfo } from "../../types/api/ChaptersInfo";

interface InfoState {
  slug?: string;
  setSlug: (slug: string) => void;
  titleInfo?: TitleInfo;
  chaptersInfo?: ChapterInfo[];
  fetchInfo(slug: string): Promise<void>;
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
    setSlug: (slug) => {
      set({ slug });
    },
    fetchInfo: async (slug) => {
      const title = await fetchTitleInfo(slug);
      const chapters = await fetchChaptersInfo(slug);

      set({ titleInfo: title, chaptersInfo: chapters });
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
        ids: new Set(chapters.flatMap(([, val]) => val.map((chapter) => chapter.id))),
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
        ids: new Set([...newState.values()].flatMap((val) => val.map((chapter) => chapter.id))),
      });
    },
    deleteChapters: (id) => {
      const newState = new Map(get().chapters);

      if (!id) set({ chapters: new Map(), ids: new Set() });
      else {
        newState.delete(id);

        set({
          chapters: newState,
          ids: new Set([...newState.values()].flatMap((val) => val.map((chapter) => chapter.id))),
        });
      }
    },
    hasChapter: (id) => get().ids.has(id),
  }))
);

export { useInfoStore, useChapterStore };
