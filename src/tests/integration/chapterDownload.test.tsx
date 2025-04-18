import { fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Title } from '../../pages/Title/Title';
import * as api from '../../utils/api';
import * as parseChapters from '../../utils/parseChapters';
import * as printBook from '../../utils/printBook';
import { mockChapters, mockTitleInfo, renderWithProviders } from '../utils/test-utils';

// Mock dependencies
vi.mock('../../utils/api');
vi.mock('../../utils/parseChapters');
vi.mock('../../utils/printBook');
vi.mock('../../hooks/state/state');

describe('Chapter Download Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('downloads selected chapters when clicking download button', async () => {
    // Setup mocks
    const mockChapterContent = {
      content: 'test content',
      name: 'Test Chapter'
    };
    const mockParsedContent = {
      paragraphs: { section: { '#': [] } },
      binaries: []
    };

    (api.fetchChapter as jest.Mock).mockResolvedValue(mockChapterContent);
    (parseChapters.default as jest.Mock).mockResolvedValue(mockParsedContent);

    // Update chapter state to be checked
    const updatedChapters = {
      ...mockChapters,
      1: { ...mockChapters[1], checked: true }
    };

    const { getByText } = renderWithProviders(<Title />, {
      initialState: {
        slug: 'test-slug',
        titleInfo: mockTitleInfo,
        chapters: updatedChapters
      }
    });

    // Click download button
    const downloadButton = getByText('Скачать');
    fireEvent.click(downloadButton);

    // Verify the complete flow
    await waitFor(() => {
      expect(api.fetchChapter).toHaveBeenCalledWith(
        'test-slug',
        undefined,
        '1',
        '1'
      );
      expect(parseChapters.default).toHaveBeenCalledWith(mockChapterContent);
      expect(printBook.default).toHaveBeenCalledWith(
        mockTitleInfo,
        '1',
        [mockParsedContent.paragraphs],
        mockParsedContent.binaries
      );
    });
  });

  it('handles errors in the download process', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    // Setup mock to throw error
    (api.fetchChapter as jest.Mock).mockRejectedValue(new Error('Network error'));

    // Update chapter state to be checked
    const updatedChapters = {
      ...mockChapters,
      1: { ...mockChapters[1], checked: true }
    };

    const { getByText } = renderWithProviders(<Title />, {
      initialState: {
        slug: 'test-slug',
        titleInfo: mockTitleInfo,
        chapters: updatedChapters
      }
    });

    // Click download button
    const downloadButton = getByText('Скачать');
    fireEvent.click(downloadButton);

    // Verify error handling
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('Network error')
      );
      expect(parseChapters.default).not.toHaveBeenCalled();
      expect(printBook.default).not.toHaveBeenCalled();
    });

    consoleError.mockRestore();
  });

  it('skips unchecked chapters during download', async () => {
    const { getByText } = renderWithProviders(<Title />, {
      initialState: {
        slug: 'test-slug',
        titleInfo: mockTitleInfo,
        chapters: mockChapters // All chapters unchecked by default
      }
    });

    // Click download button
    const downloadButton = getByText('Скачать');
    fireEvent.click(downloadButton);

    // Verify no chapters were downloaded
    expect(api.fetchChapter).not.toHaveBeenCalled();
    expect(parseChapters.default).not.toHaveBeenCalled();
    expect(printBook.default).not.toHaveBeenCalled();
  });
});