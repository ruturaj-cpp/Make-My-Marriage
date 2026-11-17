import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ApiError, apiRequest } from '../../lib/api-client';

export function InvitationAcceptPage() {
  const token = window.location.hash.slice(1);
  const queryClient = useQueryClient();
  const accept = useMutation({
    mutationFn: () =>
      apiRequest<{ success: true; data: { weddingId: string; weddingName?: string } }>(
        `/member-invitations/${encodeURIComponent(token)}/accept`,
        { method: 'POST', body: '{}' },
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      window.location.assign('/dashboard');
    },
  });
  if (!token)
    return (
      <main className="onboarding-wrap">
        <section className="onboarding-card">
          <h1>Invitation link is incomplete</h1>
          <p>Ask your partner to share the invitation link again.</p>
          <Link className="onboarding-primary onboarding-link-button" to="/dashboard">
            Go to your workspace
          </Link>
        </section>
      </main>
    );
  return (
    <main className="onboarding-wrap">
      <section className="onboarding-card onboarding-invite-accept">
        <p className="onboarding-kicker">A CELEBRATION TOGETHER</p>
        <h1>You’re invited to plan a wedding.</h1>
        <p>
          Accept the invitation to join your partner’s shared wedding workspace. You must be signed
          in with the invited email address.
        </p>
        {accept.error && (
          <p className="onboarding-error" role="alert">
            {accept.error instanceof ApiError
              ? accept.error.message
              : 'We could not accept this invitation. Please try again.'}
          </p>
        )}
        <button
          className="onboarding-primary"
          disabled={accept.isPending}
          onClick={() => accept.mutate()}
        >
          {accept.isPending ? 'Joining workspace…' : 'Accept invitation'}
        </button>
        <p className="onboarding-note">The link is private and expires after seven days.</p>
      </section>
    </main>
  );
}
