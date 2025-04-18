import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { StoreApi, UseBoundStore } from "zustand";
import { DownloadSettings } from "../../components/DownloadSettings";
import { type Chapter, InfoState, useInfoStore } from "../../hooks/state/state";
import type { Data as ChapterData } from "../../types/api/Chapter";
import type { TitleInfo } from "../../types/api/Title";
import * as api from "../../utils/api";
import * as parseChapters from "../../utils/parseChapters";
import * as printBook from "../../utils/printBook";

vi.mock("../hooks/state/state", () => ({
  useInfoStore: vi.fn(),
}));

vi.mock("../utils/api", () => ({
  fetchChapter: vi.fn(),
}));

vi.mock("../utils/parseChapters", () => ({
  default: vi.fn(),
}));

vi.mock("../utils/printBook", () => ({
  default: vi.fn(),
}));

const mockTitleInfo: Partial<TitleInfo> = {
  id: 1,
  eng_name: "Test Novel",
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

const mockChapters: Record<number, Chapter> = {
  1: {
    id: 1,
    volume: "1",
    number: "1",
    name: "Chapter 1",
    checked: true,
    volumeID: 1,
    chapterFirstID: 1,
    branches_count: 1,
    branches: [],
    index: 1,
    item_number: 1,
    number_secondary: "",
  },
};

describe("DownloadSettings component", () => {
  beforeEach(() => {
    vi.mocked(
      useInfoStore as UseBoundStore<StoreApi<InfoState>>
    ).mockImplementation(() => mockChapters);
  });

  it("renders download button", () => {
    render(
      <DownloadSettings
        slug="test-slug"
        titleInfo={mockTitleInfo as TitleInfo}
        chapters={mockChapters}
      />
    );

    expect(screen.getByText("Скачать")).toBeInTheDocument();
  });

  it("handles download when button is clicked", () => {
    const mockChapterData: Partial<ChapterData> = {
      content: "test content",
      name: "Test Chapter",
      model: "chapter",
      volume: "1",
      number: "1",
      number_secondary: "",
      slug: "test-chapter",
      branch_id: 1,
      manga_id: 1,
      created_at: "",
      moderated: { id: 1, label: "approved" },
      teams: [],
      type: "chapter",
      attachments: [],
    };

    const mockParsedChapter: parseChapters.ParsedChapter = {
      paragraphs: { section: { "#": [] } },
      binaries: [],
    };

    vi.mocked(api.fetchChapter).mockResolvedValue(
      mockChapterData as ChapterData
    );
    vi.mocked(parseChapters.default).mockResolvedValue(mockParsedChapter);

    render(
      <DownloadSettings
        slug="test-slug"
        titleInfo={mockTitleInfo as TitleInfo}
        chapters={mockChapters}
      />
    );

    const downloadButton = screen.getByText("Скачать");
    fireEvent.click(downloadButton);

    expect(api.fetchChapter).toHaveBeenCalledWith(
      "test-slug",
      undefined,
      "1",
      "1"
    );
    expect(parseChapters.default).toHaveBeenCalled();
    expect(printBook.default).toHaveBeenCalled();
  });

  it("returns null when no slug provided", () => {
    const { container } = render(
      <DownloadSettings
        slug=""
        titleInfo={mockTitleInfo as TitleInfo}
        chapters={mockChapters}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
