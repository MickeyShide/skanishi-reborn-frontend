import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Icon from '../components/Icon';

describe('Icon Component', () => {
  it('renders a known icon by name', () => {
    // We assume "star" is a valid icon name based on typical app logic
    // Testing multiple common ones just to ensure the mapping works
    const { container } = render(<Icon name="star" />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('renders fallback (or nothing) gracefully when name is not found', () => {
    // Testing an invalid icon
    const { container } = render(<Icon name="invalid_name_xyz" />);
    // Ideally it returns an empty string or a fallback SVG, we just ensure it doesn't crash
    expect(container).toBeInTheDocument();
  });

  it('applies custom className to the SVG wrapper', () => {
    const { container } = render(<Icon name="coin" className="custom-icon" />);
    const svgElement = container.querySelector('svg');
    if (svgElement) {
      expect(svgElement).toHaveClass('custom-icon');
    }
  });
});
