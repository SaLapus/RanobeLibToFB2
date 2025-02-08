import { describe, it, expect } from "vitest";
import { fetchQueryTitles, fetchTitleInfo, fetchChaptersInfo, fetchChapter } from "../utils/api";

// import { Root as QueryTitles } from "../types/api/QueryResponce";

// const fetchfetchQueryTitlesMock: QueryTitles = {
//   data: [
//     {
//       id: 1,
//       name: "Example Name",
//       rus_name: "Пример Имя",
//       eng_name: "Example Name",
//       slug: "example-name",
//       slug_url: "/example-name",
//       cover: {
//         filename: "example-cover.jpg",
//         thumbnail: "example-cover-thumb.jpg",
//         default: "example-cover-default.jpg",
//         md: "example-cover-md.jpg",
//       },
//       ageRestriction: {
//         id: 1,
//         label: "18+",
//       },
//       site: 1,
//       type: {
//         id: 1,
//         label: "Type Label",
//       },
//       releaseDate: "2024-01-01",
//       rating: {
//         average: "4.5",
//         averageFormated: "4.5",
//         votes: 123,
//         votesFormated: "123",
//         user: 5,
//       },
//       model: "ExampleModel",
//       status: {
//         id: 1,
//         label: "Ongoing",
//       },
//       releaseDateString: "1 January 2024",
//       is_authorship: true,
//     },
//   ],
//   links: {
//     first: "/api/items?page=1",
//     last: "/api/items?page=10",
//     prev: null,
//     next: "/api/items?page=2",
//   },
//   meta: {
//     current_page: 1,
//     from: 1,
//     path: "/api/items",
//     per_page: 10,
//     to: 10,
//     page: 1,
//     has_next_page: true,
//     seed: "random-seed",
//   },
// };

const slug = "73129--mushoku-tensei-isekai-ittara-honki-dasu-ln";

describe("API functions", () => {
  describe("fetchQueryTitles", () => {
    it("should fetch titles and return the response", async () => {
      const result = await fetchQueryTitles("паук");
      expect(result).toHaveLength(15);
    });

    // it("should throw an error if the response is not ok", async () => {

    //   await expect(fetchQueryTitles("some-query")).rejects.toThrow("Failed to fetch titles");
    // });
  });

  describe("fetchTitleInfo", () => {
    it("should fetch title info and return the response", async () => {
      const result = await fetchTitleInfo(slug);
      expect(result.id).toEqual(73129);
    });

    // it("should throw an error if the response is not ok", async () => {
    //   mockFetch.mockResolvedValueOnce({
    //     ok: false,
    //     json: async () => ({}),
    //   });

    //   await expect(fetchTitleInfo("1")).rejects.toThrow("Failed to fetch title info");
    // });
  });

  describe("fetchChaptersInfo", () => {
    it("should fetch chapters info and return the response", async () => {
      const result = await fetchChaptersInfo(slug);
      expect(result).toHaveLength(342);
    });

    // it("should throw an error if the response is not ok", async () => {
    //   mockFetch.mockResolvedValueOnce({
    //     ok: false,
    //     json: async () => ({}),
    //   });

    //   await expect(fetchChaptersInfo("1")).rejects.toThrow("Failed to fetch chapters info");
    // });
  });

  describe("fetchChapter", () => {
    it("should fetch a chapter and return the response", async () => {
      const result = await fetchChapter(slug, undefined, "1", "1");

      expect(result.id).toEqual(1795816);
    });

    // it("should throw an error if the response is not ok", async () => {
    //   mockFetch.mockResolvedValueOnce({
    //     ok: false,
    //     json: async () => ({}),
    //   });

    //   await expect(fetchChapter("1")).rejects.toThrow("Failed to fetch chapter");
    // });
  });
});
