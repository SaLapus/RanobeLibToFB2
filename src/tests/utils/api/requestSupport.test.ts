import { describe, expect, it, vi } from 'vitest';
import Awaiter from '../../../utils/api/awaiter';
import requestSupport from '../../../utils/api/requestSupport';

vi.mock('../utils/api/awaiter', () => ({
  default: vi.fn().mockImplementation(() => ({
    next: vi.fn().mockResolvedValue(undefined)
  }))
}));

describe('requestSupport', () => {
  const mockFunction = vi.fn();
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  beforeEach(() => {
    mockFunction.mockReset();
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls the wrapped function with correct arguments', async () => {
    mockFunction.mockResolvedValue('success');
    const wrappedFunction = requestSupport(mockFunction);
    
    await wrappedFunction('arg1', 'arg2');
    
    expect(mockFunction).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('retries on failure', async () => {
    mockFunction
      .mockRejectedValueOnce(new Error('First attempt failed'))
      .mockResolvedValueOnce('success');

    const wrappedFunction = requestSupport(mockFunction);
    const result = await wrappedFunction('test');

    expect(mockFunction).toHaveBeenCalledTimes(2);
    expect(result).toBe('success');
  });

  it('respects rate limiting', async () => {
    mockFunction.mockResolvedValue('success');
    const wrappedFunction = requestSupport(mockFunction);

    // Make multiple calls in parallel
    const promises = Array(3).fill(null).map(() => wrappedFunction('test'));
    
    // Fast-forward time to simulate rate limiting
    vi.advanceTimersByTime(60000);
    
    const results = await Promise.all(promises);
    expect(results).toEqual(['success', 'success', 'success']);
  });

  it('handles multiple concurrent requests', async () => {
    mockFunction.mockImplementation(() => delay(100).then(() => 'success'));
    const wrappedFunction = requestSupport(mockFunction);

    const results = await Promise.all([
      wrappedFunction('test1'),
      wrappedFunction('test2')
    ]);

    expect(results).toEqual(['success', 'success']);
  });

  it('logs errors to console', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFunction.mockRejectedValue(new Error('Test error'));

    const wrappedFunction = requestSupport(mockFunction);
    try {
      await wrappedFunction('test');
    } catch (e) {
      // Error is expected
    }

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('wraps function with retry logic', async () => {
    const mockFn = vi.fn().mockResolvedValue('success');
    const wrapped = requestSupport(mockFn);
    
    const result = await wrapped('test');
    
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledWith('test');
  });

  it('waits for awaiter before each attempt', async () => {
    const mockNext = vi.fn().mockResolvedValue(undefined);
    (Awaiter as jest.Mock).mockImplementation(() => ({
      next: mockNext
    }));

    const mockFn = vi.fn().mockResolvedValue('success');
    const wrapped = requestSupport(mockFn);
    
    await wrapped('test');
    
    expect(mockNext).toHaveBeenCalled();
  });

  it('retries up to 10 times before giving up', async () => {
    const error = new Error('Failed');
    const mockFn = vi.fn().mockRejectedValue(error);
    const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const wrapped = requestSupport(mockFn);
    
    try {
      await wrapped('test');
    } catch (e) {
      expect(e).toBe(error);
    }
    
    expect(mockFn).toHaveBeenCalledTimes(10);
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('Too many (10) attempts')
    );
  });

  it('preserves function name in error messages', async () => {
    const namedFunction = async function testFunction() {
      throw new Error('Failed');
    };
    
    const wrapped = requestSupport(namedFunction);
    const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    try {
      await wrapped();
    } catch (e) {
      // Continue with test
    }
    
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('testFunction')
    );
  });
});