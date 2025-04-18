import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useInfoStore } from '../../hooks/state/state';
import { Title } from '../../pages/Title/Title';
import { mockChapters, mockTitleInfo } from '../utils/test-utils';

vi.mock('../hooks/state/state', () => ({
  useInfoStore: vi.fn()
}));

describe('Title page', () => {
  beforeEach(() => {
    vi.mocked(useInfoStore).mockImplementation((selector) => 
      selector({
        slug: 'test-slug',
        titleInfo: mockTitleInfo,
        chapters: mockChapters,
        setSlug: vi.fn(),
        toggleChapter: vi.fn(),
        allChapters: vi.fn(),
        deleteChapters: vi.fn()
      })
    );
  });

  it('renders loading state when data is not ready', () => {
    vi.mocked(useInfoStore).mockImplementation((selector) => 
      selector({
        slug: undefined,
        titleInfo: undefined,
        chapters: undefined,
        setSlug: vi.fn(),
        toggleChapter: vi.fn(),
        allChapters: vi.fn(),
        deleteChapters: vi.fn()
      })
    );

    render(<Title />);
    expect(screen.getByText('⚙️Грузимся')).toBeInTheDocument();
  });

  it('renders title info when data is available', () => {
    render(<Title />);
    
    expect(screen.getByText('Novel')).toBeInTheDocument();
    expect(screen.getByText('Digital')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('Ongoing')).toBeInTheDocument();
  });

  it('renders chapter list when data is available', () => {
    render(<Title />);
    
    expect(screen.getByText('Том 1')).toBeInTheDocument();
    expect(screen.getByText('Глава 1')).toBeInTheDocument();
  });

  it('renders download settings when data is available', () => {
    render(<Title />);
    
    expect(screen.getByText('Скачать')).toBeInTheDocument();
  });
});