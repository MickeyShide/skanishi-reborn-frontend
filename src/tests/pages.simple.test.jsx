import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import NotFoundPage from '../pages/NotFoundPage';
import SplashPage from '../pages/SplashPage';

describe('Simple Pages Integration', () => {
  describe('NotFoundPage', () => {
    it('renders the 404 message and a link to home', () => {
      // MemoryRouter is required because NotFoundPage uses <Link> from react-router-dom
      render(
        <MemoryRouter initialEntries={['/invalid-route']}>
          <NotFoundPage />
        </MemoryRouter>
      );

      // Asserts that the page says "Страница не найдена" or "Not Found" 
      // or whatever the specific text is. We'll use a broad selector or check for '404'
      const text404 = screen.getByText(/404/i);
      expect(text404).toBeInTheDocument();

      // Ensure there is a link back to '/'
      const homeLink = screen.getByRole('link');
      expect(homeLink).toHaveAttribute('href', '/');
    });
  });

  describe('SplashPage', () => {
    it('renders the loading splash screen properly', () => {
      const { container } = render(
        <MemoryRouter>
          <SplashPage />
        </MemoryRouter>
      );
      
      // Splash screen usually contains the logo and maybe a spinner
      expect(container).toBeInTheDocument();
      // Since it's a visual layout wrapper, we just assert it doesn't crash on mount
    });
  });
});
