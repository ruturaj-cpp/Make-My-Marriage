import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../lib/api-client';
import type { CurrentUserResponse } from './RequireSession';
import { getOnboarding } from './onboarding-api';

export function DashboardPage() {
  const currentUser = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiRequest<CurrentUserResponse>('/auth/me'),
  });
  const onboarding = useQuery({ queryKey: ['onboarding'], queryFn: getOnboarding });
  const user = currentUser.data?.data;
  const state = onboarding.data?.data;
  return (
    <main className="onboarding-wrap">
      <section className="onboarding-card onboarding-dashboard">
        <p className="onboarding-kicker">YOUR CELEBRATION</p>
        <h1>Welcome, {user?.name ?? 'planner'}.</h1>
        <p>
          {user?.onboarding.weddingName
            ? `${user.onboarding.weddingName} is ready to plan together.`
            : 'Your wedding workspace is ready for the next planning milestone.'}
        </p>
        <div className="onboarding-callout">
          <strong>Shared wedding workspace</strong>
          <span>
            {state?.coupleDetails?.groomName && state.coupleDetails.brideName
              ? `${state.coupleDetails.groomName} & ${state.coupleDetails.brideName}`
              : 'Your wedding workspace is ready.'}
          </span>
          {state?.weddingDetails && (
            <span>
              {[
                state.weddingDetails.weddingDate,
                state.weddingDetails.city,
                state.weddingDetails.state,
              ]
                .filter(Boolean)
                .join(' · ')}
            </span>
          )}
          {state?.events?.length ? (
            <span>Planned events: {state.events.map((event) => event.name).join(', ')}</span>
          ) : null}
        </div>
        <p className="onboarding-note">
          Guest lists, budgets and event management are part of the next planning milestones.
        </p>
        <Link className="onboarding-primary onboarding-link-button" to="/">
          Back to Make My Marriage
        </Link>
      </section>
    </main>
  );
}
