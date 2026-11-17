import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { loginRequestSchema, type LoginRequest } from '@mmm/validators';
import { ApiError, apiRequest, resetCsrfToken } from '../../lib/api-client';

type LoginResponse = {
  success: true;
  message: string;
  data: { user: { id: string; name: string; email: string } };
};

export function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const returnTo = (location.state as { from?: string } | null)?.from;
  const destination = returnTo?.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/';
  const form = useForm<LoginRequest>({ resolver: zodResolver(loginRequestSchema) });
  const login = useMutation({
    mutationFn: (credentials: LoginRequest) =>
      apiRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    onSuccess: (response) => {
      resetCsrfToken();
      queryClient.setQueryData(['auth', 'me'], response.data.user);
      navigate(destination, { replace: true });
    },
    onError: (error: unknown) => {
      setFormError(
        error instanceof ApiError
          ? error.status === 401
            ? 'The email or password you entered is incorrect.'
            : error.status === 429
              ? 'Too many attempts. Please wait a moment and try again.'
              : error.message
          : 'We could not reach the service. Check your connection and try again.',
      );
    },
  });

  return (
    <main className="login-page">
      <section className="login-brand-panel" aria-label="Make My Marriage">
        <Link className="login-brand" to="/" aria-label="Make My Marriage home">
          <span className="login-brand-mark" aria-hidden="true">
            ✿
          </span>
          <span>Make My Marriage</span>
        </Link>
        <div className="login-brand-copy">
          <p className="login-eyebrow">YOUR STORY, BEAUTIFULLY PLANNED</p>
          <h1>Every beautiful celebration begins with a plan.</h1>
          <p>Bring every little detail together and make room for the moments that matter.</p>
        </div>
        <p className="login-brand-footnote">A little planning. A lot of love.</p>
      </section>

      <section className="login-form-panel" aria-labelledby="login-title">
        <div className="login-form-wrap">
          <Link className="login-mobile-brand" to="/">
            ✿ Make My Marriage
          </Link>
          <p className="login-eyebrow login-form-eyebrow">YOUR CELEBRATION AWAITS</p>
          <h2 id="login-title">Welcome Back!</h2>
          <p className="login-intro">Log in to continue planning your celebration.</p>
          {searchParams.get('registered') === '1' && (
            <p className="login-success-message" role="status">
              Your account is ready. Log in to continue.
            </p>
          )}

          <form
            className="login-form"
            noValidate
            onSubmit={form.handleSubmit((values) => {
              setFormError('');
              login.mutate(values);
            })}
          >
            <div className="login-field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(form.formState.errors.email)}
                aria-describedby={form.formState.errors.email ? 'login-email-error' : undefined}
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="login-field-error" id="login-email-error" role="alert">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Password</label>
              <div className="login-password-wrap">
                <input
                  id="login-password"
                  type={passwordVisible ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={Boolean(form.formState.errors.password)}
                  aria-describedby={
                    form.formState.errors.password ? 'login-password-error' : undefined
                  }
                  {...form.register('password')}
                />
                <button
                  className="login-password-toggle"
                  type="button"
                  aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                  aria-pressed={passwordVisible}
                  onClick={() => setPasswordVisible((visible) => !visible)}
                >
                  {passwordVisible ? 'Hide' : 'Show'}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="login-field-error" id="login-password-error" role="alert">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="login-forgot-row">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            {formError && (
              <p className="login-form-error" role="alert">
                {formError}
              </p>
            )}
            <button className="login-submit" type="submit" disabled={login.isPending}>
              {login.isPending ? 'Logging in…' : 'Log in'}
              {!login.isPending && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <p className="login-register-prompt">
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </p>
          <p className="login-secure-note">
            <span aria-hidden="true">✦</span> Your plans are private and secure
          </p>
        </div>
      </section>
    </main>
  );
}
