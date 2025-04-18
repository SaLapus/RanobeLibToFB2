import { describe, expect, it, vi } from 'vitest';
import { fetchChapter, fetchChaptersInfo, fetchQueryTitles, fetchTitleInfo } from '../../../utils/api';

// Mock global fetch
global.fetch = vi.fn();

describe('API utilities', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockReset();
  });

  describe('fetchQueryTitles', () => {
    it('fetches and transforms query results correctly', async () => {
      const mockApiResponse = {
        data: [{
          id: 1,
          rus_name: 'Test Novel',
          name: 'Original Name',
          type: { label: 'Novel' },
          status: { label: 'Ongoing' },
          releaseDateString: '2024',
          slug_url: 'test-novel',
          cover: {
            default: 'cover.jpg',
            thumbnail: 'thumb.jpg'
          }
        }]
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      });

      const result = await fetchQueryTitles('test');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('q=test')
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 1,
        rus_name: 'Test Novel',
        type: 'Novel',
        status: 'Ongoing'
      });
    });

    it('handles empty response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [] })
      });

      const result = await fetchQueryTitles('nonexistent');
      expect(result).toHaveLength(0);
    });

    it('throws error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(fetchQueryTitles('test')).rejects.toThrow();
    });
  });

  describe('fetchTitleInfo', () => {
    it('fetches title info correctly', async () => {
      const mockTitleInfo = {
        data: {
          id: 1,
          name: 'Test Title'
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTitleInfo)
      });

      const result = await fetchTitleInfo('test-slug');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('test-slug')
      );
      expect(result).toEqual(mockTitleInfo.data);
    });
  });

  describe('fetchChaptersInfo', () => {
    it('fetches chapters info correctly', async () => {
      const mockChaptersInfo = {
        data: [
          {
            id: 1,
            volume: '1',
            number: '1'
          }
        ]
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockChaptersInfo)
      });

      const result = await fetchChaptersInfo('test-slug');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('test-slug/chapters')
      );
      expect(result).toEqual(mockChaptersInfo.data);
    });
  });

  describe('fetchChapter', () => {
    it('fetches individual chapter correctly', async () => {
      const mockChapter = {
        data: {
          id: 1,
          content: 'Chapter content'
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockChapter)
      });

      const result = await fetchChapter('test-slug', 9008, '1', '1');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('test-slug/chapter')
      );
      expect(result).toEqual(mockChapter.data);
    });

    it('uses default branch_id when not provided', async () => {
      const mockChapter = {
        data: {
          id: 1,
          content: 'Chapter content'
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockChapter)
      });

      await fetchChapter('test-slug', undefined, '1', '1');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('branch_id=9008')
      );
    });
  });
});