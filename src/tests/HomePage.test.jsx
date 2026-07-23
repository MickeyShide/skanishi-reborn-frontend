import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// 1. Mock the API hooks
vi.mock('../hooks/useApi', () => ({
  useApi: () => ({
    get: vi.fn().mockResolvedValue({}),
    post: vi.fn().mockResolvedValue({}),
  }),
}));

// 2. Mock the WebAppContext
vi.mock('../context/WebAppContext', () => ({
  useWebApp: () => ({
    user: {
      id: "test-user-id",
      username: "testuser",
      display_name: "Test User",
      level: 10,
      xp: 500,
      next_level_xp: 1000,
      coins: 100,
    },
    appState: {
      season_id: "season_1",
      is_season_active: true,
    },
    ready: true,
    isLoading: false,
  }),
}));

// 3. Import HomePage AFTER the mocks
import HomePage from '../pages/HomePage';

describe('HomePage Integration', () => {
  it('renders the HomePage with mocked user data without crashing', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>
    );

    // Assert that the page mounted
    expect(container).toBeInTheDocument();
  });
});
