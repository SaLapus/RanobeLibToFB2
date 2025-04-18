import { screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import App from '../../App';
import { Search } from '../../pages/Search/Search';
import { Title } from '../../pages/Title/Title';
import { mockChapters, mockTitleInfo, renderWithProviders } from '../utils/test-utils';

vi.mock('../../hooks/state/state', () => ({
  useInfoStore: vi.fn()
}));

describe('Accessibility Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('has no accessibility violations in App component', async () => {
    const { container } = renderWithProviders(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations in Search page', async () => {
    const { container } = renderWithProviders(<Search />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations in Title page', async () => {
    const { container } = renderWithProviders(
      <Title />,
      {
        initialState: {
          slug: 'test-slug',
          titleInfo: mockTitleInfo,
          chapters: mockChapters
        }
      }
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('maintains proper heading hierarchy', () => {
    renderWithProviders(<App />);
    const h1Elements = screen.getAllByRole('heading', { level: 1 });
    expect(h1Elements).toHaveLength(1);
    expect(h1Elements[0]).toHaveTextContent('FB2Creator');
  });

  it('ensures all interactive elements are keyboard accessible', () => {
    renderWithProviders(<Title />, {
      initialState: {
        slug: 'test-slug',
        titleInfo: mockTitleInfo,
        chapters: mockChapters
      }
    });
    
    const interactiveElements = screen.getAllByRole('button');
    interactiveElements.forEach(element => {
      expect(element).toHaveAttribute('tabIndex', '0');
    });

    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      expect(checkbox).toHaveAttribute('tabIndex', '0');
    });
  });

  it('provides appropriate ARIA labels', () => {
    renderWithProviders(<Search />);
    
    const searchInput = screen.getByPlaceholderText('Искать вашу любимую новеллу');
    expect(searchInput).toHaveAttribute('aria-label', 'Поиск новеллы');
  });

  it('ensures error messages are announced to screen readers', () => {
    renderWithProviders(<Search />);
    
    const loadingMessage = screen.getByText('⚙️Грузимся');
    expect(loadingMessage).toHaveAttribute('role', 'status');
    expect(loadingMessage).toHaveAttribute('aria-live', 'polite');
  });
});