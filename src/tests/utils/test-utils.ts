import { render } from "@testing-library/react";
import { ReactElement } from "react";
import { vi } from "vitest";
import { type Chapter, useInfoStore } from "../../hooks/state/state";
import type { TitleInfo } from "../../types/api/Title";

export interface Store {
  slug: string | undefined;
  titleInfo: TitleInfo | undefined;
  chapters: Record<number, Chapter> | undefined;
  setSlug: ReturnType<typeof vi.fn>;
  toggleChapter: ReturnType<typeof vi.fn>;
  allChapters: ReturnType<typeof vi.fn>;
  deleteChapters: ReturnType<typeof vi.fn>;
}

// Mock the store
const createMockStore = (initialState: Partial<Store> = {}): Store => {
  const store: Store = {
    slug: undefined,
    titleInfo: undefined,
    chapters: undefined,
    setSlug: vi.fn(),
    toggleChapter: vi.fn(),
    allChapters: vi.fn(),
    deleteChapters: vi.fn(),
    ...initialState,
  };

  vi.mocked(useInfoStore).mockImplementation((selector) => selector(store));

  return store;
};

// Common mock data
export const mockTitleInfo: TitleInfo = {
  id: 1,
  eng_name: "Test Novel",
  rus_name: "Тестовая новелла",
  name: "Test Novel",
  slug: "test-novel",
  slug_url: "test-novel",
  cover: {
    filename: "test.jpg",
    thumbnail: "thumb.jpg",
    default: "default.jpg",
    md: "md.jpg",
  },
  background: {
    filename: null,
    url: "",
  },
  ageRestriction: {
    id: 1,
    label: "16+",
  },
  site: 1,
  type: {
    id: 1,
    label: "Novel",
  },
  summary: "Test summary",
  is_licensed: false,
  authors: [
    {
      name: "Test Author",
      id: 1,
      slug: "",
      slug_url: "",
      model: "",
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
        source_type: "",
        source_id: 0,
        relation: null,
      },
      confirmed: false,
      user_id: 0,
    },
  ],
  model: "Digital",
  status: {
    id: 1,
    label: "Ongoing",
  },
  artists: [],
  releaseDateString: "2024",
};

export const mockChapters: Record<number, Chapter> = {
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
};

interface RenderOptions {
  initialState?: Partial<Store>;
}

// Custom render function that includes providers and store setup
export function renderWithProviders(
  ui: ReactElement,
  { initialState = {} }: RenderOptions = {}
) {
  const store = createMockStore(initialState);
  const utils = render(ui);
  return {
    store,
    ...utils,
  };
}

// Helper to generate test datasets
export function generateTestChapters(count: number): Record<number, Chapter> {
  return Object.fromEntries(
    Array.from({ length: count }, (_, i) => [
      i + 1,
      {
        id: i + 1,
        volume: Math.ceil((i + 1) / 10).toString(),
        number: ((i + 1) % 10 || 10).toString(),
        name: `Chapter ${i + 1}`,
        checked: false,
        volumeID: Math.ceil((i + 1) / 10),
        chapterFirstID: i + 1,
        branches_count: 1,
        branches: [],
        index: i + 1,
        item_number: i + 1,
        number_secondary: "",
      },
    ])
  );
}

// Helper for performance measurement
export async function measurePerformance(
  callback: () => Promise<void> | void
): Promise<number> {
  const start = performance.now();
  await callback();
  return performance.now() - start;
}

// Mock API response creator
export function createMockApiResponse<T>(data: T): Response {
  return {
    ok: true,
    json: () => Promise.resolve({ data }),
  } as Response;
}
