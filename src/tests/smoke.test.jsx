import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

const SmokeComponent = () => <div>Hello React Testing Library</div>;

describe('Frontend Test Infrastructure', () => {
  it('should successfully boot jsdom and render a component', () => {
    render(<SmokeComponent />);
    
    // Assert that the component mounted and the text is in the DOM
    const element = screen.getByText('Hello React Testing Library');
    expect(element).toBeInTheDocument();
  });

  it('should support mathematical assertions to verify vitest runner', () => {
    expect(1 + 1).toBe(2);
  });
});
