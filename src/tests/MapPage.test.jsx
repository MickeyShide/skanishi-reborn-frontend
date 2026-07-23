import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../hooks/useApi', () => ({
  useApi: () => ({
    get: vi.fn().mockImplementation((url) => {
      if (url.includes('map/clusters')) {
        return Promise.resolve({
          clusters: [
            { id: 1, lat: 55.751244, lng: 37.618423, count: 5 }
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

import MapPage from '../pages/MapPage';

describe('MapPage Integration', () => {
  it('renders the MapPage without crashing despite map library complexities', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/map']}>
        <MapPage />
      </MemoryRouter>
    );

    expect(container).toBeInTheDocument();
  });
});
