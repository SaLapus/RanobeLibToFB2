import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useInfoStore } from "../../hooks/state/state";
import type { Data as ChapterInfo } from "../../types/api/ChaptersInfo";
import type { TitleInfo } from "../../types/api/Title";
import * as api from "../../utils/api";

vi.mock("../utils/api", () => ({
  fetchTitleInfo: vi.fn(),
  fetchChaptersInfo: vi.fn(),
}));

describe("InfoStore", () => {
  const mockTitle: Partial<TitleInfo> = {
    id: 1,
    name: "Test Title",
    authors: [
      {
        id: 1,
        slug: "test-author",
        slug_url: "/authors/test-author",
        model: "Author",
        name: "Test Author",
        rus_name: null,
        alt_name: null,
        cover: {
          filename: null,
          thumbnail: "",
          default: "",
          md: "",
        },
        subscription: {
          is_subscribed: false,
          source_type: "author",
          source_id: 1,
          relation: null,
        },
        confirmed: true,
        user_id: 1,
      },
    ],
  };

  beforeEach(() => {
    const { result } = renderHook(() => useInfoStore());
    act(() => {
      result.current.deleteChapters();
    });
  });

  describe("setSlug", () => {
    it("fetches title and chapter info when setting slug", async () => {
      const mockChapter: Partial<ChapterInfo> = {
        id: 1,
        volume: "1",
        number: "1",
        name: "Chapter 1",
        index: 1,
        item_number: 1,
        branches_count: 1,
        branches: [],
      };

      vi.mocked(api.fetchTitleInfo).mockResolvedValue(mockTitle as TitleInfo);
      vi.mocked(api.fetchChaptersInfo).mockResolvedValue([
        mockChapter as ChapterInfo,
      ]);

      const { result } = renderHook(() => useInfoStore());

      await act(async () => {
        await result.current.setSlug("test-slug");
      });

      expect(result.current.slug).toBe("test-slug");
      expect(result.current.titleInfo).toBeDefined();
      expect(result.current.chapters).toBeDefined();
    });
  });

  describe("chapter management", () => {
    it("toggles chapter checked state", async () => {
      const { result } = renderHook(() => useInfoStore());

      await act(async () => {
        await result.current.setSlug("test-slug");
      });

      const chapters = result.current.chapters;
      if (!chapters) throw new Error("Chapters should be defined");
      const chapterId = Number(Object.keys(chapters)[0]);

      act(() => {
        result.current.toggleChapter(chapterId);
      });

      expect(chapters[chapterId].checked).toBe(true);
    });

    it("selects all chapters", async () => {
      const { result } = renderHook(() => useInfoStore());

      await act(async () => {
        await result.current.setSlug("test-slug");
      });

      act(() => {
        result.current.allChapters();
      });

      const chapters = result.current.chapters;
      if (!chapters) throw new Error("Chapters should be defined");
      Object.values(chapters).forEach((chapter) => {
        expect(chapter.checked).toBe(true);
      });
    });

    it("deselects all chapters", async () => {
      const { result } = renderHook(() => useInfoStore());

      await act(async () => {
        await result.current.setSlug("test-slug");
        result.current.allChapters();
        result.current.deleteChapters();
      });

      const chapters = result.current.chapters;
      if (!chapters) throw new Error("Chapters should be defined");
      Object.values(chapters).forEach((chapter) => {
        expect(chapter.checked).toBe(false);
      });
    });
  });
});
