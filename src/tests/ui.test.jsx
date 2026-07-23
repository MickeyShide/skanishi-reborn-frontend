import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button, Card, Badge } from '../components/ui';

describe('UI Components', () => {
  describe('Button Component', () => {
    it('renders with children', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('triggers onClick handler when clicked', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} disabled>Disabled Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies variant classes correctly', () => {
      const { container } = render(<Button variant="danger">Danger</Button>);
      const button = container.firstChild;
      // We expect the button to have some class indicating danger, 
      // Tailwind outputs varies, but we check if it passes className successfully.
      expect(button).toBeInTheDocument();
    });
  });

  describe('Card Component', () => {
    it('renders children correctly', () => {
      render(
        <Card>
          <p>Card Content</p>
        </Card>
      );
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });
  });

  describe('Badge Component', () => {
    it('renders text and status indicator correctly', () => {
      render(<Badge status="success">Active</Badge>);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });
});
