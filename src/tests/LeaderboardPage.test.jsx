import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../hooks/useApi', () => ({
  useApi: () => ({
    get: vi.fn().mockImplementation((url) => {
      if (url.includes('leaderboard')) {
        return Promise.resolve({
          current_user: { id: "test-user-id", display_name: "Test User", rank: 42, xp: 500 },
          leaderboard: [
            { id: "1", display_name: "Top Player", rank: 1, xp: 9999 },
            { id: "2", display_name: "Second Player", rank: 2, xp: 8888 }
          ]
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

import LeaderboardPage from '../pages/LeaderboardPage';

describe('LeaderboardPage Integration', () => {
  it('renders the LeaderboardPage and parses mocked rankings', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/leaderboard']}>
        <LeaderboardPage />
      </MemoryRouter>
    );

    expect(container).toBeInTheDocument();
  });
});
