import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { HomePage } from '../routes/HomePage';
import { NotFoundPage } from '../routes/NotFoundPage';
import { LoginPage } from '../features/auth/LoginPage';
import { RegistrationPage } from '../features/auth/RegistrationPage';
import { RequireSession } from '../features/onboarding/RequireSession';
import { OnboardingPage } from '../features/onboarding/OnboardingPage';
import { InvitationAcceptPage } from '../features/onboarding/InvitationAcceptPage';
import { DashboardPage } from '../features/onboarding/DashboardPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegistrationPage /> },
      {
        element: <RequireSession />,
        children: [
          { path: '/onboarding/:step', element: <OnboardingPage /> },
          { path: '/invitations/accept', element: <InvitationAcceptPage /> },
          { path: '/dashboard', element: <DashboardPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
