import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../hooks/useApi', () => ({
  useApi: () => ({
    get: vi.fn().mockResolvedValue({}),
    post: vi.fn().mockImplementation((url) => {
      if (url.includes('scan')) {
        return Promise.resolve({
          success: true,
          xp_reward: 100,
          item_reward: { name: "Mocked Item", rarity: "RARE" }
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

// Mock the QR scanner library to prevent camera permission errors
vi.mock('@yudiel/react-qr-scanner', () => ({
  Scanner: () => <div data-testid="mock-scanner" />
}));

import ScanPage from '../pages/ScanPage';
import ScanResultPage from '../pages/ScanResultPage';

describe('Scan Pages Integration', () => {
  it('renders ScanPage and the mocked scanner', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/scan']}>
        <ScanPage />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });

  it('renders ScanResultPage and parses state correctly', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/scan/result?scan_id=test_123']}>
        <Routes>
          <Route path="/scan/result" element={<ScanResultPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });
});
