import { useQuery } from '@tanstack/react-query';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { apiRequest, ApiError } from '../../lib/api-client';

export type CurrentUserResponse = {
  success: true;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    preferredLanguage: 'en' | 'mr' | 'hi';
    onboarding: {
      status: 'in_progress' | 'completed';
      currentStep: string;
      weddingId: string | null;
      weddingName?: string | null;
    };
  };
};

export function RequireSession() {
  const location = useLocation();
  const currentUser = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiRequest<CurrentUserResponse>('/auth/me'),
    retry: (count, error) => !(error instanceof ApiError && error.status === 401) && count < 1,
  });

  if (currentUser.isPending)
    return (
      <div className="onboarding-loading" role="status">
        Checking your session…
      </div>
    );
  if (currentUser.error instanceof ApiError && currentUser.error.status === 401) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    );
  }
  if (currentUser.error)
    return (
      <div className="onboarding-load-error" role="alert">
        We couldn’t load your account. Please try again.
      </div>
    );
  return <Outlet />;
}
