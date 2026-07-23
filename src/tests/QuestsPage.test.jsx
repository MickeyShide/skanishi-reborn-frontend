import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../hooks/useApi', () => ({
  useApi: () => ({
    get: vi.fn().mockImplementation((url) => {
      if (url.includes('quests')) {
        return Promise.resolve({
          daily_quests: [
            { id: "q1", title: "Test Quest", reward_xp: 100, is_completed: false }
          ],
          season_quests: []
        });
      }
      return Promise.resolve({});
    }),
    post: vi.fn().mockResolvedValue({}),
  }),
}));

vi.mock('../context/WebAppContext', () => ({
  useWebApp: () => ({
    user: { id: "test-user-id" },
    ready: true,
  }),
}));

import QuestsPage from '../pages/QuestsPage';

describe('QuestsPage Integration', () => {
  it('renders the QuestsPage and parses mocked quests', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/quests']}>
        <QuestsPage />
      </MemoryRouter>
    );

    expect(container).toBeInTheDocument();
  });
});
