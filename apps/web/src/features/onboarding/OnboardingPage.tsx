import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  coupleDetailsFormSchema,
  partnerInvitationFormSchema,
  weddingDetailsFormSchema,
  type OnboardingStep,
} from '@mmm/validators';
import { ApiError } from '../../lib/api-client';
import {
  completeOnboarding,
  getOnboarding,
  saveOnboarding,
  type OnboardingEvent,
  type OnboardingState,
} from './onboarding-api';

const steps: { id: OnboardingStep; title: string; short: string }[] = [
  { id: 'welcome', title: "Let's Plan Your Dream Wedding!", short: 'Welcome' },
  { id: 'couple-details', title: 'Tell Us About the Couple', short: 'Couple' },
  { id: 'wedding-details', title: 'When and Where Are You Celebrating?', short: 'Wedding' },
  { id: 'wedding-events', title: 'What Events Are You Planning?', short: 'Events' },
  { id: 'invite-partner', title: 'Plan Together, Celebrate Together!', short: 'Partner' },
  { id: 'review', title: 'Your Wedding Workspace Is Almost Ready!', short: 'Review' },
];

const starterEvents = [
  'Engagement',
  'Haldi Ceremony',
  'Mehendi',
  'Sangeet & Party',
  'Wedding Ceremony',
  'Reception',
  'Pooja & Blessings',
];

function getStep(value?: string): OnboardingStep | undefined {
  return steps.find((step) => step.id === value)?.id;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="onboarding-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function OnboardingPage() {
  const { step: routeStep } = useParams();
  const step = getStep(routeStep);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const stateQuery = useQuery({ queryKey: ['onboarding'], queryFn: getOnboarding });
  const state = stateQuery.data?.data;
  const [draft, setDraft] = useState<OnboardingState | null>(null);
  const [customName, setCustomName] = useState('');
  const [localError, setLocalError] = useState('');
  const [inviteUrl, setInviteUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pendingAutosave = useRef<Promise<unknown> | null>(null);

  useEffect(() => {
    if (state) setDraft(state);
  }, [state]);

  const saveMutation = useMutation({
    mutationFn: saveOnboarding,
    onSuccess: (response) => {
      queryClient.setQueryData(['onboarding'], response);
      setDraft(response.data);
      setLocalError('');
    },
    onError: (error: unknown) =>
      setLocalError(
        error instanceof ApiError
          ? error.message
          : 'We could not save your progress. Please try again.',
      ),
  });
  const completeMutation = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: async (response) => {
      setInviteUrl(
        response.data.inviteUrl
          ? new URL(response.data.inviteUrl, window.location.origin).toString()
          : '',
      );
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      await queryClient.invalidateQueries({ queryKey: ['onboarding'] });
      if (!response.data.inviteUrl) navigate('/dashboard', { replace: true });
    },
    onError: (error: unknown) =>
      setLocalError(
        error instanceof ApiError
          ? error.message
          : 'We could not create your wedding workspace. Please try again.',
      ),
  });

  const stepIndex = step ? steps.findIndex((item) => item.id === step) : -1;
  const selectedEvents = draft?.events ?? [];
  const eventNames = useMemo(
    () => new Set(selectedEvents.map((event) => event.name)),
    [selectedEvents],
  );

  useEffect(() => {
    if (
      !state ||
      !draft ||
      !step ||
      !['couple-details', 'wedding-details', 'wedding-events', 'invite-partner'].includes(step)
    )
      return;
    const data =
      step === 'couple-details'
        ? (draft.coupleDetails ?? {})
        : step === 'wedding-details'
          ? (draft.weddingDetails ?? {})
          : step === 'wedding-events'
            ? { events: draft.events }
            : { invitation: draft.invitation ?? {} };
    const savedData =
      step === 'couple-details'
        ? (state.coupleDetails ?? {})
        : step === 'wedding-details'
          ? (state.weddingDetails ?? {})
          : step === 'wedding-events'
            ? { events: state.events }
            : { invitation: state.invitation ?? {} };
    if (JSON.stringify(data) === JSON.stringify(savedData)) return;
    autosaveTimer.current = setTimeout(() => {
      const request = saveOnboarding({ step, data, completed: false })
        .then((response) => {
          queryClient.setQueryData(['onboarding'], response);
        })
        .catch((error: unknown) => {
          setLocalError(
            error instanceof ApiError ? error.message : 'Your latest change could not be saved.',
          );
        })
        .finally(() => {
          pendingAutosave.current = null;
        });
      pendingAutosave.current = request;
    }, 650);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [draft, queryClient, state, step]);

  if (!step) return <Navigate to="/onboarding/welcome" replace />;
  if (stateQuery.isPending)
    return (
      <div className="onboarding-loading" role="status">
        Preparing your celebration…
      </div>
    );
  if (stateQuery.isError)
    return (
      <main className="onboarding-wrap">
        <div className="onboarding-card">
          <h1>We couldn’t load your plans</h1>
          <p>Check your connection, then try again.</p>
          <button className="onboarding-primary" onClick={() => void stateQuery.refetch()}>
            Try again
          </button>
        </div>
      </main>
    );
  if (!state || !draft)
    return (
      <div className="onboarding-loading" role="status">
        Preparing your celebration…
      </div>
    );
  if (state.status === 'completed' && !inviteUrl) return <Navigate to="/dashboard" replace />;
  if (stepIndex > 0 && !draft.completedSteps.includes(steps[stepIndex - 1]!.id)) {
    return <Navigate to={`/onboarding/${draft.currentStep}`} replace />;
  }
  if (inviteUrl)
    return (
      <main className="onboarding-wrap">
        <div className="onboarding-card onboarding-complete">
          <span className="onboarding-sparkle" aria-hidden="true">
            ✦
          </span>
          <p className="onboarding-kicker">YOUR INVITATION IS READY</p>
          <h1>Now make it a celebration together.</h1>
          <p>
            Your wedding workspace is ready. Share this private link with your partner. It expires
            in 7 days and only the invited email can accept it.
          </p>
          <div className="onboarding-share">
            <input aria-label="Partner invitation link" readOnly value={inviteUrl} />
            <button
              className="onboarding-secondary"
              onClick={async () => {
                await navigator.clipboard.writeText(inviteUrl);
                setCopied(true);
              }}
            >
              {' '}
              {copied ? 'Copied' : 'Copy link'}
            </button>
          </div>
          <p className="onboarding-note">
            Email delivery is not configured, so no email has been sent. Your partner must sign in
            or create an account with the invited email address.
          </p>
          <Link className="onboarding-primary onboarding-link-button" to="/dashboard">
            Go to your workspace
          </Link>
        </div>
      </main>
    );

  const updateDraft = (
    part: 'coupleDetails' | 'weddingDetails' | 'invitation',
    key: string,
    value: string,
  ) => {
    setDraft((current) =>
      current ? { ...current, [part]: { ...(current[part] ?? {}), [key]: value } } : current,
    );
  };
  const persist = async (completed: boolean, destination?: OnboardingStep) => {
    setLocalError('');
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    if (pendingAutosave.current) await pendingAutosave.current;
    if (step === 'couple-details') {
      const validation = coupleDetailsFormSchema.safeParse(draft.coupleDetails ?? {});
      if (!validation.success) {
        setLocalError(validation.error.issues[0]?.message ?? 'Check the couple details.');
        return null;
      }
    }
    if (step === 'wedding-details') {
      const validation = weddingDetailsFormSchema.safeParse(draft.weddingDetails ?? {});
      if (!validation.success) {
        setLocalError(validation.error.issues[0]?.message ?? 'Check the wedding details.');
        return null;
      }
    }
    if (step === 'invite-partner') {
      const validation = partnerInvitationFormSchema.safeParse(draft.invitation ?? {});
      if (!validation.success) {
        setLocalError(validation.error.issues[0]?.message ?? 'Check the invitation details.');
        return null;
      }
      const currentUser = queryClient.getQueryData<{ data?: { email?: string } }>(['auth', 'me']);
      if (
        draft.invitation?.email &&
        currentUser?.data?.email?.toLowerCase() === draft.invitation.email.toLowerCase()
      ) {
        setLocalError('You cannot invite your own account as your partner.');
        return null;
      }
    }
    const data =
      step === 'couple-details'
        ? (draft.coupleDetails ?? {})
        : step === 'wedding-details'
          ? (draft.weddingDetails ?? {})
          : step === 'wedding-events'
            ? { events: draft.events }
            : step === 'invite-partner'
              ? { invitation: draft.invitation ?? {} }
              : {};
    try {
      const saved = await saveMutation.mutateAsync({ step, data, completed });
      if (destination) navigate(`/onboarding/${destination}`);
      else if (completed && stepIndex < steps.length - 1)
        navigate(`/onboarding/${steps[stepIndex + 1]!.id}`);
      return saved;
    } catch (error) {
      if (
        step === 'couple-details' &&
        (!draft.coupleDetails?.groomName?.trim() || !draft.coupleDetails?.brideName?.trim())
      )
        setLocalError('Please enter both names to continue.');
      else if (
        step === 'wedding-details' &&
        (!draft.weddingDetails?.city?.trim() || !draft.weddingDetails?.state?.trim())
      )
        setLocalError('Please enter the wedding city and state to continue.');
      else if (!(error instanceof ApiError))
        setLocalError('We could not save your progress. Please try again.');
      return null;
    }
  };
  const toggleEvent = (name: string, custom = false) =>
    setDraft((current) => {
      if (!current) return current;
      const events = current.events ?? [];
      return {
        ...current,
        events: events.some((event) => event.name === name)
          ? events.filter((event) => event.name !== name)
          : [...events, { name, custom }],
      };
    });
  const goBack = async () => {
    if (stepIndex <= 0) return;
    if (
      step &&
      ['couple-details', 'wedding-details', 'wedding-events', 'invite-partner'].includes(step)
    ) {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      if (pendingAutosave.current) await pendingAutosave.current;
      const data =
        step === 'couple-details'
          ? (draft.coupleDetails ?? {})
          : step === 'wedding-details'
            ? (draft.weddingDetails ?? {})
            : step === 'wedding-events'
              ? { events: draft.events }
              : { invitation: draft.invitation ?? {} };
      try {
        await saveMutation.mutateAsync({ step, data, completed: false });
      } catch {
        setLocalError('We could not save your latest changes. Please try again.');
        return;
      }
    }
    navigate(`/onboarding/${steps[stepIndex - 1]!.id}`);
  };
  const busy = saveMutation.isPending || completeMutation.isPending;

  return (
    <main className="onboarding-wrap">
      <header className="onboarding-header">
        <Link to="/" className="onboarding-brand">
          <span aria-hidden="true">✿</span> Make My Marriage
        </Link>
        <span>Your plans are saved as you go</span>
      </header>
      <section className="onboarding-layout" aria-label="Wedding onboarding">
        <aside className="onboarding-aside">
          <p className="onboarding-kicker">YOUR STORY, BEAUTIFULLY PLANNED</p>
          <h1>Let’s make this celebration yours.</h1>
          <p>Bring your people, traditions and plans together in one shared place.</p>
          <ol className="onboarding-steps">
            {steps.map((item, index) => (
              <li
                key={item.id}
                className={index === stepIndex ? 'is-active' : index < stepIndex ? 'is-done' : ''}
              >
                <span>{index < stepIndex ? '✓' : index + 1}</span>
                {item.short}
              </li>
            ))}
          </ol>
        </aside>
        <div className="onboarding-card">
          <div className="onboarding-progress">
            <span style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} />
          </div>
          <p className="onboarding-kicker">
            STEP {stepIndex + 1} OF {steps.length}
          </p>
          <h2>{steps[stepIndex]!.title}</h2>
          {step === 'welcome' && (
            <div className="onboarding-content">
              <p className="onboarding-lead">Let’s Plan Your Dream Wedding!</p>
              <p>
                Your beautiful wedding journey starts here. Set up your wedding workspace and bring
                every celebration together in one place.
              </p>
              <div
                className="onboarding-welcome-visual"
                role="img"
                aria-label="Indian wedding mandap illustration"
              >
                <span aria-hidden="true">✿</span>
                <strong>A celebration made yours</strong>
                <small>Your plans, traditions and people in one place</small>
              </div>
              <div className="onboarding-callout">
                <strong>One shared wedding workspace</strong>
                <span>
                  Keep your plans together and invite your partner to manage everything with you.
                </span>
              </div>
            </div>
          )}
          {step === 'couple-details' && (
            <div className="onboarding-content">
              <p>Let’s start with the two people at the heart of this sacred celebration.</p>
              <Field label="Groom’s full name">
                <input
                  autoComplete="name"
                  value={draft.coupleDetails?.groomName ?? ''}
                  onChange={(event) =>
                    updateDraft('coupleDetails', 'groomName', event.target.value)
                  }
                  placeholder="Full name"
                  required
                />
              </Field>
              <PhotoPicker label="Groom’s profile photo (optional)" />
              <Field label="Bride’s full name">
                <input
                  autoComplete="name"
                  value={draft.coupleDetails?.brideName ?? ''}
                  onChange={(event) =>
                    updateDraft('coupleDetails', 'brideName', event.target.value)
                  }
                  placeholder="Full name"
                  required
                />
              </Field>
              <PhotoPicker label="Bride’s profile photo (optional)" />
            </div>
          )}
          {step === 'wedding-details' && (
            <div className="onboarding-content">
              <p>Share what you know so far. Your date and venue can be added later.</p>
              <Field label="Wedding date (optional)">
                <input
                  type="date"
                  value={draft.weddingDetails?.weddingDate ?? ''}
                  onChange={(event) =>
                    updateDraft('weddingDetails', 'weddingDate', event.target.value)
                  }
                />
              </Field>
              <div className="onboarding-fields-row">
                <Field label="Wedding city">
                  <input
                    value={draft.weddingDetails?.city ?? ''}
                    onChange={(event) => updateDraft('weddingDetails', 'city', event.target.value)}
                    list="indian-city-suggestions"
                    placeholder="e.g. Jaipur"
                    required
                  />
                  <datalist id="indian-city-suggestions">
                    <option>Ahmedabad</option>
                    <option>Bengaluru</option>
                    <option>Chennai</option>
                    <option>Delhi</option>
                    <option>Hyderabad</option>
                    <option>Jaipur</option>
                    <option>Kochi</option>
                    <option>Kolkata</option>
                    <option>Mumbai</option>
                    <option>Pune</option>
                    <option>Udaipur</option>
                  </datalist>
                </Field>
                <Field label="State">
                  <input
                    value={draft.weddingDetails?.state ?? ''}
                    onChange={(event) => updateDraft('weddingDetails', 'state', event.target.value)}
                    list="indian-state-suggestions"
                    placeholder="e.g. Rajasthan"
                    required
                  />
                  <datalist id="indian-state-suggestions">
                    <option>Andhra Pradesh</option>
                    <option>Assam</option>
                    <option>Bihar</option>
                    <option>Goa</option>
                    <option>Gujarat</option>
                    <option>Haryana</option>
                    <option>Himachal Pradesh</option>
                    <option>Karnataka</option>
                    <option>Kerala</option>
                    <option>Madhya Pradesh</option>
                    <option>Maharashtra</option>
                    <option>Odisha</option>
                    <option>Punjab</option>
                    <option>Rajasthan</option>
                    <option>Tamil Nadu</option>
                    <option>Telangana</option>
                    <option>Uttar Pradesh</option>
                    <option>Uttarakhand</option>
                    <option>West Bengal</option>
                  </datalist>
                </Field>
              </div>
              <Field label="Wedding venue name (optional)">
                <input
                  value={draft.weddingDetails?.venueName ?? ''}
                  onChange={(event) =>
                    updateDraft('weddingDetails', 'venueName', event.target.value)
                  }
                  placeholder="Venue or location name"
                />
              </Field>
              <Field label="Wedding type (optional)">
                <select
                  value={draft.weddingDetails?.weddingType ?? ''}
                  onChange={(event) =>
                    updateDraft('weddingDetails', 'weddingType', event.target.value)
                  }
                >
                  <option value="">Choose a style</option>
                  <option>Traditional Vedic</option>
                  <option>Destination Wedding</option>
                  <option>Intimate Gathering</option>
                  <option>Royal &amp; Heritage</option>
                  <option>Modern &amp; Fusion</option>
                  <option>Custom / Other</option>
                </select>
              </Field>
            </div>
          )}
          {step === 'wedding-events' && (
            <div className="onboarding-content">
              <p>Choose the moments you’re planning. You can add dates later.</p>
              <div className="onboarding-event-list">
                {starterEvents.map((name) => (
                  <label key={name} className="onboarding-event">
                    <input
                      type="checkbox"
                      checked={eventNames.has(name)}
                      onChange={() => toggleEvent(name)}
                    />
                    <span>{name}</span>
                  </label>
                ))}
              </div>
              <div className="onboarding-add-event">
                <input
                  value={customName}
                  onChange={(event) => setCustomName(event.target.value)}
                  placeholder="Add Custom Event"
                  aria-label="Custom event name"
                />
                <button
                  type="button"
                  className="onboarding-secondary"
                  onClick={() => {
                    const name = customName.trim();
                    if (name && !eventNames.has(name)) {
                      toggleEvent(name, true);
                      setCustomName('');
                    }
                  }}
                >
                  Add
                </button>
              </div>
              {selectedEvents.map((event: OnboardingEvent) => (
                <Field key={event.name} label={`${event.name} date (optional)`}>
                  <input
                    type="date"
                    value={event.eventDate ?? ''}
                    onChange={(change) =>
                      setDraft((current) =>
                        current
                          ? {
                              ...current,
                              events: current.events.map((item) =>
                                item.name === event.name
                                  ? { ...item, eventDate: change.target.value }
                                  : item,
                              ),
                            }
                          : current,
                      )
                    }
                  />
                </Field>
              ))}
              {selectedEvents
                .filter((event) => event.custom)
                .map((event) => (
                  <label key={event.name} className="onboarding-event">
                    <input type="checkbox" checked onChange={() => toggleEvent(event.name, true)} />
                    <span>{event.name} (custom)</span>
                  </label>
                ))}
            </div>
          )}
          {step === 'invite-partner' && (
            <div className="onboarding-content">
              <p>
                Your wedding is a shared journey. Invite your partner to plan and manage everything
                together.
              </p>
              <Field label="Partner’s email address (optional)">
                <input
                  type="email"
                  autoComplete="email"
                  value={draft.invitation?.email ?? ''}
                  onChange={(event) => updateDraft('invitation', 'email', event.target.value)}
                  placeholder="partner@example.com"
                />
              </Field>
              <Field label="A note for them (optional)">
                <textarea
                  rows={3}
                  maxLength={500}
                  value={draft.invitation?.message ?? ''}
                  onChange={(event) => updateDraft('invitation', 'message', event.target.value)}
                  placeholder="I can’t wait to plan this together…"
                />
              </Field>
              <div className="onboarding-callout">
                <strong>One shared workspace</strong>
                <span>
                  You’ll be the workspace owner. Your partner joins after signing in with the
                  invited email and accepting the secure link.
                </span>
              </div>
            </div>
          )}
          {step === 'review' && (
            <div className="onboarding-content">
              <p>Take a look at the details before creating your private workspace.</p>
              <ReviewSection
                title="Couple details"
                onEdit={() => navigate('/onboarding/couple-details')}
              >
                <strong>
                  {draft.coupleDetails?.groomName} &amp; {draft.coupleDetails?.brideName}
                </strong>
                <span>Profile photos can be added after secure photo storage is connected.</span>
              </ReviewSection>
              <ReviewSection
                title="Wedding details"
                onEdit={() => navigate('/onboarding/wedding-details')}
              >
                <strong>{draft.weddingDetails?.weddingDate || 'Date not set'}</strong>
                <span>
                  {[draft.weddingDetails?.city, draft.weddingDetails?.state]
                    .filter(Boolean)
                    .join(', ')}
                </span>
                <span>
                  {[draft.weddingDetails?.venueName, draft.weddingDetails?.weddingType]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              </ReviewSection>
              <ReviewSection
                title="Wedding events"
                onEdit={() => navigate('/onboarding/wedding-events')}
              >
                <strong>
                  {selectedEvents.length
                    ? selectedEvents.map((event) => event.name).join(', ')
                    : 'No events selected'}
                </strong>
                {selectedEvents
                  .filter((event) => event.eventDate)
                  .map((event) => (
                    <span key={event.name}>
                      {event.name}: {event.eventDate}
                    </span>
                  ))}
              </ReviewSection>
              <ReviewSection
                title="Partner invitation"
                onEdit={() => navigate('/onboarding/invite-partner')}
              >
                <strong>{draft.invitation?.email || 'No partner invited yet'}</strong>
                <span>
                  {draft.invitation?.email
                    ? 'Not sent yet · a private invitation link will be ready after workspace creation.'
                    : 'Not sent'}
                </span>
              </ReviewSection>
              <p className="onboarding-note">
                Creating the workspace saves your details and selected events. No invitation email
                is sent from this app yet.
              </p>
            </div>
          )}
          {localError && (
            <p className="onboarding-error" role="alert">
              {localError}
            </p>
          )}
          <footer className="onboarding-actions">
            {stepIndex > 0 ? (
              <button className="onboarding-back" type="button" onClick={goBack} disabled={busy}>
                Back
              </button>
            ) : (
              <span />
            )}
            {step === 'review' ? (
              <button
                className="onboarding-primary"
                type="button"
                disabled={busy}
                onClick={() => completeMutation.mutate()}
              >
                {completeMutation.isPending
                  ? 'Creating your workspace…'
                  : 'Create my wedding workspace'}
              </button>
            ) : (
              <button
                className="onboarding-primary"
                type="button"
                disabled={busy}
                onClick={() => void persist(true)}
              >
                {saveMutation.isPending
                  ? 'Saving…'
                  : step === 'welcome'
                    ? 'Start Planning'
                    : step === 'invite-partner'
                      ? 'Continue to review'
                      : 'Continue'}{' '}
                <span aria-hidden="true">→</span>
              </button>
            )}
          </footer>
          {step === 'wedding-events' && (
            <button
              className="onboarding-skip"
              type="button"
              disabled={busy}
              onClick={() => void persist(true)}
            >
              Skip for now
            </button>
          )}
          {step === 'invite-partner' && (
            <button
              className="onboarding-skip"
              type="button"
              disabled={busy}
              onClick={async () => {
                setDraft((current) => (current ? { ...current, invitation: null } : current));
                await saveMutation
                  .mutateAsync({
                    step: 'invite-partner',
                    data: { invitation: {} },
                    completed: true,
                  })
                  .then((response) => {
                    queryClient.setQueryData(['onboarding'], response);
                    setDraft(response.data);
                    navigate('/onboarding/review');
                  })
                  .catch(() => setLocalError('We could not save your progress. Please try again.'));
              }}
            >
              I’ll invite my partner later
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <section className="onboarding-review-section">
      <div className="onboarding-review-heading">
        <h3>{title}</h3>
        <button type="button" onClick={onEdit}>
          Edit
        </button>
      </div>
      <div className="onboarding-review-values">{children}</div>
    </section>
  );
}

function PhotoPicker({ label }: { label: string }) {
  const [preview, setPreview] = useState('');
  const [fileError, setFileError] = useState('');
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  return (
    <div className="onboarding-photo-picker">
      <label>
        <span>{label}</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label={label}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
              setFileError('Choose a JPG, PNG or WebP image.');
              event.target.value = '';
              return;
            }
            if (file.size > 5 * 1024 * 1024) {
              setFileError('Choose an image smaller than 5 MB.');
              event.target.value = '';
              return;
            }
            setFileError('');
            setPreview(URL.createObjectURL(file));
          }}
        />
      </label>
      {preview && <img src={preview} alt="Selected photo preview (not uploaded)" />}
      {fileError && (
        <small role="alert" className="onboarding-error">
          {fileError}
        </small>
      )}
      <small>
        Choose a JPG, PNG or WebP up to 5 MB. Preview only; permanent photo upload is not available
        yet.
      </small>
    </div>
  );
}
