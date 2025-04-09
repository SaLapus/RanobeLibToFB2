import type { } from "@redux-devtools/extension"; // required for devtools typing\
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { fetchChaptersInfo, fetchTitleInfo } from "../../utils/api";

import type { Data as ChapterInfo } from "../../types/api/ChaptersInfo";
import type { TitleInfo } from "../../types/api/Title";

interface Chapter extends ChapterInfo {
  checked: boolean;
}
interface InfoState {
  slug: string | undefined;
  setSlug(slug: string): Promise<void>;

  titleInfo?: TitleInfo;
  chaptersInfo?: ChapterInfo[];

  chapters?: Record<number, Chapter>;

  toggleChapter(chapterID: number): void;
  allChapters(): void;
  deleteChapters(): void;
}

const useInfoStore = create<InfoState>()(
  immer((set) => ({
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

        void Promise.resolve(() =>
          set({
            chapters: chapters.reduce((acc, cur) => {
              acc[cur.id] = { ...cur, checked: false };
              return acc;
            }, {} as Record<number, Chapter>),
          })
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    toggleChapter: (chapterID) =>
      set((state: InfoState) => {
        if (state.chapters)
          state.chapters[chapterID].checked =
            !state.chapters[chapterID].checked;
      }),
    allChapters() {
      set((state: InfoState) => {
        if (state.chapters) {
          for (const key of Object.keys(state.chapters))
            state.chapters[key as unknown as number].checked = true;
        }
      });
    },
    deleteChapters() {
      set((state: InfoState) => {
        if (state.chapters) {
          for (const key of Object.keys(state.chapters))
            state.chapters[key as unknown as number].checked = false;
        }
      });
    },
  }))
);

interface ChoosedChaptersState {
  chapters: Chapter[];
}

const useChapterStore = create<ChoosedChaptersState>()(
  devtools((set, get) => ({
    chapters: [] as Chapter[],
    ids: new Set(),
    addChapters: (chapterID: number) => {
      set({
        chapters: new Map(chapters),
        ids: new Set(
          chapters.flatMap(([, val]) => val.map((chapter) => chapter.id))
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

    hasChapter: (id) => get().ids.has(id),
  }))
);

export { useChapterStore, useInfoStore };

