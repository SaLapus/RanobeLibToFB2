import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from '../../App';
import type { QueryResult } from '../../types/api/QueryResponce';
import * as api from '../../utils/api';
import { mockChapters, mockTitleInfo, renderWithProviders } from '../utils/test-utils';

vi.mock('../../utils/api');
vi.mock('../../hooks/state/state');

describe('Search to Title Flow Integration', () => {
  const mockSearchResult: QueryResult[] = [{
    id: 1,
    rus_name: 'Test Novel',
    type: 'Novel',
    status: 'Ongoing',
    year: '2024',
    slug_url: 'test-novel',
    cover: {
      default: 'test.jpg',
      thumb: 'test-thumb.jpg'
    }
  }];

  beforeEach(() => {
    vi.clearAllMocks();
    (api.fetchQueryTitles as jest.Mock).mockResolvedValue(mockSearchResult);
    (api.fetchTitleInfo as jest.Mock).mockResolvedValue(mockTitleInfo);
    (api.fetchChaptersInfo as jest.Mock).mockResolvedValue([mockChapters[1]]);
  });

  it('completes full flow from search to title view', async () => {
    // Render the app
    const { container } = renderWithProviders(<App />);

    // Verify we start with search view
    const searchInput = screen.getByPlaceholderText('Искать вашу любимую новеллу');
    expect(searchInput).toBeInTheDocument();

    // Type search query
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Wait for search results
    await waitFor(() => {
      expect(api.fetchQueryTitles).toHaveBeenCalledWith('test');
      expect(screen.getByText('Test Novel')).toBeInTheDocument();
    });

    // Click on search result
    const searchResult = screen.getByText('Test Novel');
    fireEvent.click(searchResult);

    // Verify title info is fetched
    await waitFor(() => {
      expect(api.fetchTitleInfo).toHaveBeenCalledWith('test-novel');
      expect(api.fetchChaptersInfo).toHaveBeenCalledWith('test-novel');
    });

    // Verify title view is rendered
    await waitFor(() => {
      expect(screen.getByText('Digital')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('Глава 1')).toBeInTheDocument();
    });

    // Verify page accessibility
    expect(container.querySelector('main')).toHaveAttribute('role', 'main');
  });

  it('handles API errors during the flow', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    (api.fetchQueryTitles as jest.Mock).mockRejectedValue(new Error('Network error'));

    renderWithProviders(<App />);

    const searchInput = screen.getByPlaceholderText('Искать вашу любимую новеллу');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('Network error')
      );
    });

    consoleError.mockRestore();
  });

  it('handles loading states correctly', async () => {
    // Add delay to API calls to simulate loading
    (api.fetchQueryTitles as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockSearchResult), 100))
    );

    renderWithProviders(<App />);

    const searchInput = screen.getByPlaceholderText('Искать вашу любимую новеллу');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Verify loading spinner is shown
    expect(screen.getByRole('status')).toBeVisible();

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('Test Novel')).toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeVisible();
    });
  });

  it('preserves search input value during navigation', () => {
    renderWithProviders(<App />);

    const searchInput = screen.getByPlaceholderText('Искать вашу любимую новеллу');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect((searchInput as HTMLInputElement).value).toBe('test');
  });
});