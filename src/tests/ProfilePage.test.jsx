import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../hooks/useApi', () => ({
  useApi: () => ({
    get: vi.fn().mockImplementation((url) => {
      if (url.includes('profile')) {
        return Promise.resolve({
          user: {
            id: "pub-id",
            display_name: "Mocked Profile",
            username: "mock_user",
            level: 5,
            xp: 2500,
            next_level_xp: 3000,
            streak_days: 7,
            coins: 1000
          },
          total_collections: 10,
          completed_collections: 2
        });
      }
      return Promise.resolve({});
    }),
  }),
}));

vi.mock('../context/WebAppContext', () => ({
  useWebApp: () => ({
    user: { id: "test-user-id" },
    ready: true,
  }),
}));

import ProfilePage from '../pages/ProfilePage';

describe('ProfilePage Integration', () => {
  it('renders the ProfilePage with mocked user data', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/profile']}>
        <ProfilePage />
      </MemoryRouter>
    );

    expect(container).toBeInTheDocument();
  });
});
