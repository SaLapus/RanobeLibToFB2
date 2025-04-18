import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from '../../App';
import { mockChapters, mockTitleInfo, renderWithProviders } from '../utils/test-utils';

vi.mock('../hooks/state/state', () => ({
  useInfoStore: vi.fn()
}));

describe('App component', () => {
  it('renders header with title', () => {
    renderWithProviders(<App />);
    expect(screen.getByText('FB2Creator')).toBeInTheDocument();
  });

  it('shows search by default when no slug', () => {
    renderWithProviders(<App />);
    expect(screen.getByPlaceholderText('Искать вашу любимую новеллу')).toBeInTheDocument();
  });

  it('shows title page when slug is set', () => {
    renderWithProviders(<App />, {
      initialState: {
        slug: 'test-slug',
        titleInfo: mockTitleInfo,
        chapters: mockChapters
      }
    });
    
    expect(screen.getByText(mockTitleInfo.rus_name)).toBeInTheDocument();
  });

  it('maintains consistent layout structure', () => {
    renderWithProviders(<App />);
    
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    
    expect(header).toBeInTheDocument();
    expect(main).toBeInTheDocument();
    expect(header).toHaveAttribute('role', 'banner');
    expect(main).toHaveAttribute('role', 'main');
  });
});