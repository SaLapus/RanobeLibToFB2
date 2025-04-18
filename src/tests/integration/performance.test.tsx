import { fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Title } from '../../pages/Title/Title';
import * as api from '../../utils/api';
import { generateTestChapters, measurePerformance, mockTitleInfo, renderWithProviders } from '../utils/test-utils';

vi.mock('../../utils/api');
vi.mock('../../hooks/state/state');

describe('Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles large chapter lists efficiently', async () => {
    // Create a large dataset of 1000 chapters
    const largeChapterSet = generateTestChapters(1000);

    const { getByLabelText } = renderWithProviders(<Title />, {
      initialState: {
        slug: 'test-slug',
        titleInfo: mockTitleInfo,
        chapters: largeChapterSet
      }
    });

    const renderTime = await measurePerformance(() => {
      renderWithProviders(<Title />, {
        initialState: {
          slug: 'test-slug',
          titleInfo: mockTitleInfo,
          chapters: largeChapterSet
        }
      });
    });

    // Initial render should be fast (under 100ms)
    expect(renderTime).toBeLessThan(100);

    // Test select all performance
    const selectAllCheckbox = getByLabelText('Выбрать все');
    const selectTime = await measurePerformance(() => {
      fireEvent.click(selectAllCheckbox);
    });

    // Selecting all chapters should be fast (under 50ms)
    expect(selectTime).toBeLessThan(50);
  });

  it('efficiently handles parallel chapter downloads', async () => {
    // Setup test data with 50 chapters
    const chapters = generateTestChapters(50);
    const checkedChapters = Object.fromEntries(
      Object.entries(chapters).map(([id, chapter]) => [
        id,
        { ...chapter, checked: true }
      ])
    );

    // Mock API calls with controlled timing
    (api.fetchChapter as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        content: 'test content',
        name: 'Test Chapter'
      }), 50))
    );

    const { getByText } = renderWithProviders(<Title />, {
      initialState: {
        slug: 'test-slug',
        titleInfo: mockTitleInfo,
        chapters: checkedChapters
      }
    });

    const downloadButton = getByText('Скачать');
    const downloadTime = await measurePerformance(async () => {
      fireEvent.click(downloadButton);
      await waitFor(() => {
        expect(api.fetchChapter).toHaveBeenCalledTimes(50);
      });
    });

    // All chapters should download within reasonable time (considering rate limiting)
    // With 50ms per chapter but parallel processing, should take less than total sequential time
    expect(downloadTime).toBeLessThan(50 * 50);
  });

  it('maintains responsiveness during heavy operations', async () => {
    const chapters = generateTestChapters(100);
    const checkedChapters = Object.fromEntries(
      Object.entries(chapters).map(([id, chapter]) => [
        id,
        { ...chapter, checked: true }
      ])
    );

    const { getByText, getAllByRole } = renderWithProviders(<Title />, {
      initialState: {
        slug: 'test-slug',
        titleInfo: mockTitleInfo,
        chapters: checkedChapters
      }
    });

    // Start heavy operation
    const downloadButton = getByText('Скачать');
    fireEvent.click(downloadButton);

    // Test UI responsiveness during download
    const checkboxes = getAllByRole('checkbox');
    const responseTime = await measurePerformance(() => {
      fireEvent.click(checkboxes[1]); // Get first chapter checkbox
    });

    // UI interactions should remain fast even during background operations
    expect(responseTime).toBeLessThan(16); // Under 1 frame (60fps)
  });
});