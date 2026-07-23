import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../hooks/useApi', () => ({
  useApi: () => ({
    get: vi.fn().mockImplementation((url) => {
      if (url.includes('collections')) {
        return Promise.resolve({
          collections: [
            { id: 1, name: "Test Collection", total_items: 5, collected_items: 2, icon_url: "icon.png" }
          ]
        });
      }
      if (url.includes('events')) {
        return Promise.resolve({
          events: [
            { id: 1, name: "Test Event", is_active: true }
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

import CollectionsPage from '../pages/CollectionsPage';
import EventsPage from '../pages/EventsPage';

describe('Collections and Events Pages Integration', () => {
  it('renders CollectionsPage with mocked data', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/collections']}>
        <CollectionsPage />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });

  it('renders EventsPage with mocked data', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/events']}>
        <EventsPage />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });
});
