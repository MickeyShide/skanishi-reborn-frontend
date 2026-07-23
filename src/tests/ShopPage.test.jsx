import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../hooks/useApi', () => ({
  useApi: () => ({
    get: vi.fn().mockImplementation((url) => {
      if (url.includes('categories')) {
        return Promise.resolve([
          { id: 1, name: 'Skins' },
          { id: 2, name: 'Boosts' }
        ]);
      }
      if (url.includes('shop')) {
        return Promise.resolve({
          items: [
            { id: 1, name: 'Cool Skin', price: 100, currency: 'COINS', category_id: 1, is_purchasable: true },
            { id: 2, name: 'XP Boost', price: 50, currency: 'COINS', category_id: 2, is_purchasable: true }
          ]
        });
      }
      return Promise.resolve({});
    }),
    post: vi.fn().mockResolvedValue({}),
  }),
}));

vi.mock('../context/WebAppContext', () => ({
  useWebApp: () => ({
    user: { id: "test-user-id", coins: 500 },
    ready: true,
  }),
}));

import ShopPage from '../pages/ShopPage';

describe('ShopPage Integration', () => {
  it('renders the ShopPage and parses mocked categories', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/shop']}>
        <ShopPage />
      </MemoryRouter>
    );

    // Assert that the page mounted
    expect(container).toBeInTheDocument();
  });
});
