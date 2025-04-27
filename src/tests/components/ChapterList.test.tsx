import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { StoreApi, UseBoundStore } from "zustand";
import ChapterList from "../../components/ChapterList";
import { type Chapter, useInfoStore } from "../../hooks/state/state";

interface MockStore {
  toggleChapter: (chapterId: number) => void;
  allChapters: (chapterIds?: number[]) => void;
  deleteChapters: (chapterIds?: number[]) => void;
}

vi.mock("../../hooks/state/state", () => ({
  useInfoStore: vi.fn(),
}));

const mockChapters: Record<number, Chapter> = {
  1: {
    id: 1,
    volume: "1",
    number: "1",
    name: "Chapter 1",
    checked: false,
    volumeID: 1,
    chapterFirstID: 1,
    branches_count: 1,
    branches: [],
    index: 1,
    item_number: 1,
    number_secondary: "",
  },
  2: {
    id: 2,
    volume: "1",
    number: "2",
    name: "Chapter 2",
    checked: false,
    volumeID: 1,
    chapterFirstID: 2,
    branches_count: 1,
    branches: [],
    index: 2,
    item_number: 2,
    number_secondary: "",
  },
};

describe("ChapterList component", () => {
  const mockToggleChapter = vi.fn();
  const mockAllChapters = vi.fn();
  const mockDeleteChapters = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(
      useInfoStore as UseBoundStore<StoreApi<MockStore>>
    ).mockImplementation((selector) =>
      selector({
        toggleChapter: mockToggleChapter,
        allChapters: mockAllChapters,
        deleteChapters: mockDeleteChapters,
      })
    );
  });

  it("renders volume and chapter list correctly", () => {
    render(<ChapterList chapters={mockChapters} />);

    expect(screen.getByText("Том 1")).toBeInTheDocument();

    // Click volume to expand chapters
    fireEvent.click(screen.getByText("Том 1").nextElementSibling!);

    expect(screen.getByText("Глава 1")).toBeInTheDocument();
    expect(screen.getByText("Глава 2")).toBeInTheDocument();
  });

  it("toggles chapter visibility when volume arrow is clicked", () => {
    render(<ChapterList chapters={mockChapters} />);

    // Initially chapters should not be visible
    expect(screen.queryByText("Глава 1")).not.toBeInTheDocument();

    // Click volume arrow to expand
    fireEvent.click(screen.getByText("Том 1").nextElementSibling!);
    expect(screen.getByText("Глава 1")).toBeInTheDocument();

    // Click again to collapse
    fireEvent.click(screen.getByText("Том 1").nextElementSibling!);
    expect(screen.queryByText("Глава 1")).not.toBeInTheDocument();
  });

  it("toggles chapter when clicked", () => {
    render(<ChapterList chapters={mockChapters} />);

    // Expand volume first
    fireEvent.click(screen.getByText("Том 1").nextElementSibling!);

    // Click on chapter
    const chapter = screen.getByText("Глава 1");
    fireEvent.click(chapter.closest("li")!);

    expect(mockToggleChapter).toHaveBeenCalledWith(1);
  });

  it("selects all chapters in volume when volume checkbox is clicked", () => {
    render(<ChapterList chapters={mockChapters} />);

    const volumeElement = screen.getByText("Том 1").closest("li")!;
    fireEvent.click(volumeElement);

    expect(mockAllChapters).toHaveBeenCalledWith([1, 2]);
  });

  it("deselects all chapters in volume when volume checkbox is clicked and all chapters are selected", () => {
    const selectedChapters = {
      ...mockChapters,
      1: { ...mockChapters[1], checked: true },
      2: { ...mockChapters[2], checked: true },
    };

    render(<ChapterList chapters={selectedChapters} />);

    const volumeElement = screen.getByText("Том 1").closest("li")!;
    fireEvent.click(volumeElement);

    expect(mockDeleteChapters).toHaveBeenCalledWith([1, 2]);
  });
});
