import { describe, expect, it, vi } from "vitest";
import {
  fetchChapter,
  fetchChaptersInfo,
  fetchQueryTitles,
  fetchTitleInfo,
} from "../../../utils/api";

// Mock global fetch
global.fetch = vi.fn();

const MOCK_SLUG = "73129--mushoku-tensei-isekai-ittara-honki-dasu-ln";

describe("API utilities", () => {
  beforeEach(() => {
    vi.mocked(fetch).mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("fetchQueryTitles", () => {
    it("fetches and transforms query results correctly", async () => {
      const mockApiResponse = {
        data: [
          {
            id: 1,
            rus_name: "Test Novel",
            name: "Original Name",
            type: { label: "Novel" },
            status: { label: "Ongoing" },
            releaseDateString: "2024",
            slug_url: "test-novel",
            cover: {
              default: "cover.jpg",
              thumbnail: "thumb.jpg",
            },
          },
        ],
      };

      vi.mocked(fetch, { partial: true }).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      const result = await fetchQueryTitles("test");

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("q=test"));
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 1,
        rus_name: "Test Novel",
        type: "Novel",
        status: "Ongoing",
      });
    });

    it("fetches multiple titles", async () => {
      const mockApiResponse = {
        data: Array.from({ length: 15 }, (_, i) => ({
          id: i + 1,
          rus_name: `Novel ${i + 1}`,
          name: `Original Name ${i + 1}`,
          type: { label: "Novel" },
          status: { label: "Ongoing" },
          releaseDateString: "2024",
          slug_url: `test-novel-${i + 1}`,
          cover: {
            default: "cover.jpg",
            thumbnail: "thumb.jpg",
          },
        })),
      };

      vi.mocked(fetch, { partial: true }).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      const result = await fetchQueryTitles("паук");
      expect(result).toHaveLength(15);
    });

    it("handles empty response", async () => {
      vi.mocked(fetch, { partial: true }).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      });

      const result = await fetchQueryTitles("nonexistent");
      expect(result).toHaveLength(0);
    });

    it("throws error on failed request", async () => {
      vi.useFakeTimers();
      vi.mocked(fetch, { partial: true }).mockResolvedValue({
        ok: false,
        status: 404,
      });

      await expect(
        Promise.all([fetchQueryTitles("test"), vi.runAllTimersAsync()])
      ).rejects.toThrow();
    });
  });

  describe("fetchTitleInfo", () => {
    it("fetches title info correctly", async () => {
      const mockTitleInfo = {
        data: {
          id: 73129,
          name: "Test Title",
        },
      };

      vi.mocked(fetch, { partial: true }).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTitleInfo),
      });

      const result = await fetchTitleInfo(MOCK_SLUG);

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(MOCK_SLUG));
      expect(result).toEqual(mockTitleInfo.data);
      expect(result.id).toEqual(73129);
    });

    it("throws error on failed request", async () => {
      vi.useFakeTimers();
      vi.mocked(fetch, { partial: true }).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(
        Promise.all([fetchTitleInfo(MOCK_SLUG), vi.runAllTimersAsync()])
      ).rejects.toThrow();
    });
  });

  describe("fetchChaptersInfo", () => {
    it("fetches chapters info correctly", async () => {
      const mockChaptersInfo = {
        data: Array.from({ length: 342 }, (_, i) => ({
          id: i + 1,
          volume: Math.floor(i / 50) + 1,
          number: (i % 50) + 1,
        })),
      };

      vi.mocked(fetch, { partial: true }).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockChaptersInfo),
      });

      const result = await fetchChaptersInfo(MOCK_SLUG);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`${MOCK_SLUG}/chapters`)
      );
      expect(result).toEqual(mockChaptersInfo.data);
      expect(result).toHaveLength(342);
    });

    it("throws error on failed request", async () => {
      vi.useFakeTimers();
      vi.mocked(fetch, { partial: true }).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(
        Promise.all([fetchChaptersInfo(MOCK_SLUG), vi.runAllTimersAsync()])
      ).rejects.toThrow();
    });
  });

  describe("fetchChapter", () => {
    it("fetches individual chapter correctly", async () => {
      const mockChapter = {
        data: {
          id: 1795816,
          content: "Chapter content",
        },
      };

      vi.mocked(fetch, { partial: true }).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockChapter),
      });

      const result = await fetchChapter(MOCK_SLUG, 9008, "1", "1");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`${MOCK_SLUG}/chapter`)
      );
      expect(result).toEqual(mockChapter.data);
      expect(result.id).toEqual(1795816);
    });

    it("uses default branch_id when not provided", async () => {
      const mockChapter = {
        data: {
          id: 1795816,
          content: "Chapter content",
        },
      };

      vi.mocked(fetch, { partial: true }).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockChapter),
      });

      await fetchChapter(MOCK_SLUG, undefined, "1", "1");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("branch_id=9008")
      );
    });

    it("throws error on failed request", async () => {
      vi.useFakeTimers();
      vi.mocked(fetch, { partial: true }).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(
        Promise.all([
          fetchChapter(MOCK_SLUG, 9008, "1", "1"),
          vi.runAllTimersAsync(),
        ])
      ).rejects.toThrow();
    });
  });
});
