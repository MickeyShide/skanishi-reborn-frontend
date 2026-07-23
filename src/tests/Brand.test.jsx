import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Brand from '../components/Brand';

describe('Brand Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Brand />);
    // Should render an SVG
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Brand className="custom-test-class" />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toHaveClass('custom-test-class');
  });
});
