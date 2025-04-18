import { describe, expect, it } from 'vitest';
import mime from '../../utils/mimeBicycle';

describe('mimeBicycle', () => {
  it('returns correct mime type for jpg images', () => {
    const result = mime.lookup('https://example.com/image.jpg');
    expect(result).toBe('image/jpeg');
  });

  it('returns correct mime type for png images', () => {
    const result = mime.lookup('https://example.com/image.png');
    expect(result).toBe('image/png');
  });

  it('returns correct mime type for webp images', () => {
    const result = mime.lookup('https://example.com/image.webp');
    expect(result).toBe('image/webp');
  });

  it('handles URLs with query parameters', () => {
    const result = mime.lookup('https://example.com/image.jpg?width=100&height=100');
    expect(result).toBe('image/jpeg');
  });

  it('handles URLs with hash fragments', () => {
    const result = mime.lookup('https://example.com/image.png#fragment');
    expect(result).toBe('image/png');
  });

  it('handles complex paths', () => {
    const result = mime.lookup('https://example.com/path/to/subfolder/image.jpg');
    expect(result).toBe('image/jpeg');
  });
});