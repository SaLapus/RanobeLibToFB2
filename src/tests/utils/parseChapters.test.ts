import { describe, expect, it } from 'vitest';
import { Data as ChapterData } from '../../types/api/Chapter';
import parseChapter, { XMLNode } from '../../utils/parseChapters';

type NodeWithTitle = XMLNode & {
  title: {
    '#': string;
  };
};

type NodeWithParagraph = XMLNode & {
  p: {
    '#': {
      strong: {
        '#': string;
      };
    }[];
  };
};

type NodeWithImage = XMLNode & {
  image: {
    '@': {
      'l:href': string;
    };
  };
};

const isNodeWithTitle = (node: unknown): node is NodeWithTitle => {
  if (typeof node !== 'object' || node === null) return false;
  const n = node as Record<string, unknown>;
  return 'title' in n && typeof n.title === 'object' && n.title !== null && '#' in (n.title as Record<string, unknown>);
};

const isNodeWithParagraph = (node: unknown): node is NodeWithParagraph => {
  if (typeof node !== 'object' || node === null) return false;
  const n = node as Record<string, unknown>;
  return 'p' in n && typeof n.p === 'object' && n.p !== null && '#' in (n.p as Record<string, unknown>);
};

const isNodeWithImage = (node: unknown): node is NodeWithImage => {
  if (typeof node !== 'object' || node === null) return false;
  const n = node as Record<string, unknown>;
  return 'image' in n && 
         typeof n.image === 'object' && 
         n.image !== null && 
         '@' in (n.image as Record<string, unknown>);
};

describe('parseChapter', () => {
  it('parses string content correctly', async () => {
    const mockChapterData: ChapterData = {
      id: 1,
      content: '<p>Test content</p>',
      name: 'Test Chapter',
      attachments: [],
      model: 'chapter',
      volume: '1',
      number: '1',
      number_secondary: '',
      slug: 'test-chapter',
      branch_id: 1,
      manga_id: 1,
      created_at: '',
      moderated: { id: 1, label: 'approved' },
      likes_count: 0,
      teams: [],
      type: 'chapter'
    };

    const result = await parseChapter(mockChapterData);
    
    expect(result.paragraphs).toBeDefined();
    const sections = result.paragraphs.section['#'];
    if (!Array.isArray(sections)) throw new Error('Sections should be an array');
    
    const titleNode = sections[0];
    expect(isNodeWithTitle(titleNode)).toBe(true);
    if (isNodeWithTitle(titleNode)) {
      expect(titleNode.title['#']).toBe('Test Chapter');
    }
  });

  it('parses doc content correctly', async () => {
    const mockChapterData: ChapterData = {
      id: 1,
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Test content',
                marks: [{ type: 'bold' }]
              }
            ]
          }
        ]
      },
      name: 'Test Chapter',
      attachments: [],
      model: 'chapter',
      volume: '1',
      number: '1',
      number_secondary: '',
      slug: 'test-chapter',
      branch_id: 1,
      manga_id: 1,
      created_at: '',
      moderated: { id: 1, label: 'approved' },
      likes_count: 0,
      teams: [],
      type: 'chapter'
    };

    const result = await parseChapter(mockChapterData);
    
    expect(result.paragraphs).toBeDefined();
    const sections = result.paragraphs.section['#'];
    if (!Array.isArray(sections)) throw new Error('Sections should be an array');

    const titleNode = sections[0];
    expect(isNodeWithTitle(titleNode)).toBe(true);
    if (isNodeWithTitle(titleNode)) {
      expect(titleNode.title['#']).toBe('Test Chapter');
    }

    const paragraphNode = sections[1];
    expect(isNodeWithParagraph(paragraphNode)).toBe(true);
    if (isNodeWithParagraph(paragraphNode)) {
      expect(paragraphNode.p['#'][0].strong['#']).toBe('Test content');
    }
  });

  it('handles images in content', async () => {
    const mockChapterData: ChapterData = {
      id: 1,
      content: {
        type: 'doc',
        content: [
          {
            type: 'image',
            attrs: {
              description: 'Test image',
              images: [{ image: 'test-image.jpg' }]
            }
          }
        ]
      },
      name: 'Test Chapter',
      attachments: [
        {
          id: 1,
          filename: 'test-image.jpg',
          name: 'test-image.jpg',
          extension: 'jpg',
          url: 'https://example.com/test-image.jpg',
          width: 100,
          height: 100
        }
      ],
      model: 'chapter',
      volume: '1',
      number: '1',
      number_secondary: '',
      slug: 'test-chapter',
      branch_id: 1,
      manga_id: 1,
      created_at: '',
      moderated: { id: 1, label: 'approved' },
      likes_count: 0,
      teams: [],
      type: 'chapter'
    };

    const result = await parseChapter(mockChapterData);
    
    expect(result.paragraphs).toBeDefined();
    const sections = result.paragraphs.section['#'];
    if (!Array.isArray(sections)) throw new Error('Sections should be an array');

    const imageNode = sections.find(isNodeWithImage);
    expect(imageNode).toBeDefined();
    if (imageNode) {
      expect(imageNode.image['@']['l:href']).toBe('#test-image.jpg');
    }
  });
});