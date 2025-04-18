import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TitleInfo } from '../../components/TitleInfo';
import { mockChapters, mockTitleInfo } from '../utils/test-utils';

describe('TitleInfo component', () => {
  it('renders title info correctly', () => {
    render(<TitleInfo titleInfo={mockTitleInfo} chapters={mockChapters} />);
    
    expect(screen.getByText('Novel')).toBeInTheDocument();
    expect(screen.getByText('Digital')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // chapter count
    expect(screen.getByText('Ongoing')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });
});