import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { StoreApi, UseBoundStore } from 'zustand';
import ChapterList from '../../components/ChapterList';
import { type Chapter, useInfoStore } from '../../hooks/state/state';

interface MockStore {
  toggleChapter: (chapterId: number) => void;
  allChapters: () => void;
  deleteChapters: () => void;
}

vi.mock('../hooks/state/state', () => ({
  useInfoStore: vi.fn()
}));

const mockChapters: Record<number, Chapter> = {
  1: {
    id: 1,
    volume: '1',
    number: '1',
    name: 'Chapter 1',
    checked: false,
    volumeID: 1,
    chapterFirstID: 1,
    branches_count: 1,
    branches: [],
    index: 1,
    item_number: 1,
    number_secondary: ''
  },
  2: {
    id: 2,
    volume: '1',
    number: '2',
    name: 'Chapter 2',
    checked: false,
    volumeID: 1,
    chapterFirstID: 2,
    branches_count: 1,
    branches: [],
    index: 2,
    item_number: 2,
    number_secondary: ''
  }
};

describe('ChapterList component', () => {
  const mockToggleChapter = vi.fn();
  const mockAllChapters = vi.fn();
  const mockDeleteChapters = vi.fn();

  beforeEach(() => {
    vi.mocked(useInfoStore as UseBoundStore<StoreApi<MockStore>>).mockImplementation((selector) => 
      selector({
        toggleChapter: mockToggleChapter,
        allChapters: mockAllChapters,
        deleteChapters: mockDeleteChapters
      })
    );
  });

  it('renders chapter list correctly', () => {
    render(<ChapterList chapters={mockChapters} />);
    
    expect(screen.getByText('Том 1')).toBeInTheDocument();
    expect(screen.getByText('Глава 1')).toBeInTheDocument();
    expect(screen.getByText('Глава 2')).toBeInTheDocument();
  });

  it('toggles chapter when clicked', () => {
    render(<ChapterList chapters={mockChapters} />);
    
    const chapterRow = screen.getByText('Chapter 1').closest('tr');
    fireEvent.click(chapterRow!);
    
    expect(mockToggleChapter).toHaveBeenCalledWith(1);
  });

  it('selects all chapters when "Выбрать все" is checked', () => {
    render(<ChapterList chapters={mockChapters} />);
    
    const selectAllCheckbox = screen.getByLabelText('Выбрать все');
    fireEvent.click(selectAllCheckbox);
    
    expect(mockAllChapters).toHaveBeenCalled();
  });

  it('deselects all chapters when "Выбрать все" is unchecked', () => {
    render(<ChapterList chapters={mockChapters} />);
    
    const selectAllCheckbox = screen.getByLabelText('Выбрать все');
    fireEvent.click(selectAllCheckbox);
    fireEvent.click(selectAllCheckbox);
    
    expect(mockDeleteChapters).toHaveBeenCalled();
  });
});