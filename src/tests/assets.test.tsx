import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import reactLogo from '../assets/react.svg';

describe('Asset imports', () => {
  it('loads React logo SVG correctly', () => {
    // Test that the SVG file is correctly imported as a URL
    expect(reactLogo).toMatch(/^(?:data:|blob:|\/).+\.svg/);
  });

  it('renders React logo SVG', () => {
    const { container } = render(<img src={reactLogo} alt="React logo" />);
    const img = container.querySelector('img');
    
    expect(img).toBeTruthy();
    expect(img?.src).toMatch(/^(?:data:|blob:|\/).+\.svg/);
    expect(img?.alt).toBe('React logo');
  });
});