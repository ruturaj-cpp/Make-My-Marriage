import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OnboardingPage } from './OnboardingPage';
import { getOnboarding, saveOnboarding } from './onboarding-api';

vi.mock('./onboarding-api', () => ({
  getOnboarding: vi.fn(),
  saveOnboarding: vi.fn(),
  completeOnboarding: vi.fn(),
}));

const initialState = {
  status: 'in_progress' as const,
  currentStep: 'welcome' as const,
  completedSteps: [],
  coupleDetails: {},
  weddingDetails: {},
  events: [],
  invitation: null,
  weddingId: null,
};

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/onboarding/welcome']}>
        <Routes>
          <Route path="/onboarding/:step" element={<OnboardingPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('OnboardingPage', () => {
  beforeEach(() => {
    vi.mocked(getOnboarding).mockResolvedValue({
      success: true,
      message: 'ok',
      data: initialState,
    });
    vi.mocked(saveOnboarding).mockImplementation(async (input) => ({
      success: true,
      message: 'saved',
      data: { ...initialState, currentStep: 'couple-details', completedSteps: [input.step] },
    }));
  });

  it('shows the welcome step and saves it before continuing to couple details', async () => {
    renderPage();
    expect(
      await screen.findByRole('heading', { name: "Let's Plan Your Dream Wedding!" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Start Planning/ }));
    await waitFor(() => expect(vi.mocked(saveOnboarding).mock.calls.length).toBeGreaterThan(0));
    expect(vi.mocked(saveOnboarding).mock.calls[0]?.[0]).toEqual({
      step: 'welcome',
      data: {},
      completed: true,
    });
    expect(
      await screen.findByRole('heading', { name: 'Tell Us About the Couple' }),
    ).toBeInTheDocument();
  });
});
