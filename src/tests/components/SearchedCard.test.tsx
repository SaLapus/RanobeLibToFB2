import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SearchedCard } from '../../components/SearchedCard';
import { useInfoStore } from '../../hooks/state/state';

vi.mock('../hooks/state/state', () => ({
  useInfoStore: vi.fn()
}));

const mockNovel = {
  id: 1,
  rus_name: 'Test Novel',
  orig_name: 'Test Novel Original',
  type: 'Novel',
  status: 'Ongoing',
  year: '2024',
  slug_url: 'test-novel',
  cover: {
    default: 'test.jpg',
    thumb: 'test-thumb.jpg'
  }
};

describe('SearchedCard component', () => {
  const mockSetSlug = vi.fn();

  beforeEach(() => {
    vi.mocked(useInfoStore).mockImplementation((selector) => selector({
      slug: undefined,
      setSlug: mockSetSlug,
      toggleChapter: vi.fn(),
      allChapters: vi.fn(),
      deleteChapters: vi.fn()
    }));
  });

  it('renders novel information correctly', () => {
    render(<SearchedCard novel={mockNovel} />);
    
    expect(screen.getByText('Test Novel')).toBeInTheDocument();
    expect(screen.getByText('Ongoing')).toBeInTheDocument();
    expect(screen.getByText('Novel, 2024')).toBeInTheDocument();
    expect(screen.getByAltText('Обложка Test Novel')).toBeInTheDocument();
  });

  it('calls setSlug when clicked', () => {
    render(<SearchedCard novel={mockNovel} />);
    
    fireEvent.click(screen.getByText('Test Novel'));
    expect(mockSetSlug).toHaveBeenCalledWith('test-novel');
  });
});