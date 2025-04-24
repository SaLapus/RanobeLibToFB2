import { describe, expect, it } from 'vitest';
import { Chapter } from '../../hooks/state/state';
import { groupBy, sortChapters } from '../../utils/cmpChapters';

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
  },
  3: {
    id: 3,
    volume: '2',
    number: '1',
    name: 'Chapter 3',
    checked: false,
    volumeID: 2,
    chapterFirstID: 1,
    branches_count: 1,
    branches: [],
    index: 3,
    item_number: 3,
    number_secondary: ''
  }
};

describe('Chapter comparison utilities', () => {
  describe('groupBy', () => {
    it('groups chapters by volume correctly', () => {
      const result = groupBy('volume', mockChapters);
      
      expect(Object.keys(result)).toHaveLength(2);
      expect(result['1']).toHaveLength(2);
      expect(result['2']).toHaveLength(1);
    });

    it('groups chapters by number correctly', () => {
      const result = groupBy('number', mockChapters, 2);
      
      expect(Object.keys(result)).toHaveLength(2);
      expect(result['0']).toBeDefined();
      expect(result['1']).toBeDefined();
    });
  });

  describe('sortChapters', () => {
    it('sorts chapters by volume and chapter number', () => {
      const chapters = Object.values(mockChapters);
      const shuffled = [...chapters].sort(() => Math.random() - 0.5);
      
      const sorted = shuffled.sort(sortChapters());
      
      expect(sorted[0].id).toBe(1);
      expect(sorted[1].id).toBe(2);
      expect(sorted[2].id).toBe(3);
    });

    it('handles chapters with same volume but different numbers', () => {
      const chapter1 = { ...mockChapters[1] };
      const chapter2 = { ...mockChapters[2] };
      
      const result = [chapter2, chapter1].sort(sortChapters());
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });
  });
});