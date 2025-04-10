import type { } from "@redux-devtools/extension"; // required for devtools typing\
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { fetchChaptersInfo, fetchTitleInfo } from "../../utils/api";

import type { Data as ChapterInfo } from "../../types/api/ChaptersInfo";
import type { TitleInfo } from "../../types/api/Title";

export interface Chapter extends ChapterInfo {
  checked: boolean;

  volumeID: number;
  chapterFirstID: number;
  chapterSecondID?: number;
}
interface InfoState {
  slug: string | undefined;
  setSlug: (slug: string) => Promise<void>;

  titleInfo?: TitleInfo;
  chaptersInfo?: ChapterInfo[];

  chapters?: Record<number, Chapter>;

  toggleChapter: (chapterID: number) => void;
  allChapters: () => void;
  deleteChapters: () => void;
}

const useInfoStore = create<InfoState>()(
  devtools(
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

          set({
            titleInfo: title,
            chaptersInfo: chapters,
            slug,
            chapters: chapters.reduce((acc, cur) => {
              const [, first, second] = /(\d+)\.?(\d*)/.exec(cur.number)!;
              const sec = parseInt(second, 10);
              acc[cur.id] = {
                ...cur,
                volumeID: parseInt(cur.volume, 10),
                chapterFirstID: parseInt(first, 10),
                chapterSecondID: isNaN(sec) ? sec : undefined,
                checked: false,
              };
              return acc;
            }, {} as Record<number, Chapter>),
          });
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
      allChapters: () => {
        set((state: InfoState) => {
          if (state.chapters) {
            for (const key of Object.keys(state.chapters))
              state.chapters[key as unknown as number].checked = true;
          }
        });
      },
      deleteChapters: () => {
        set((state: InfoState) => {
          if (state.chapters) {
            for (const key of Object.keys(state.chapters))
              state.chapters[key as unknown as number].checked = false;
          }
        });
      },
    }))
  )
);

export { useInfoStore };

