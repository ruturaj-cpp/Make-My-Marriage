import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
  registrationFormSchema,
  type RegistrationFormValues,
  type RegistrationRequest,
} from '@mmm/validators';
import { ApiError, apiRequest } from '../../lib/api-client';

type RegistrationResponse = {
  success: true;
  message: string;
  data: { user: { id: string; name: string; email: string } };
};

export function RegistrationPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const form = useForm<RegistrationFormValues>({ resolver: zodResolver(registrationFormSchema) });
  const registration = useMutation({
    mutationFn: (values: RegistrationFormValues) => {
      const input: RegistrationRequest = {
        name: values.name,
        email: values.email,
        password: values.password,
      };
      return apiRequest<RegistrationResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    },
    onSuccess: () => navigate('/login?registered=1', { replace: true }),
    onError: (error: unknown) => {
      setFormError(
        error instanceof ApiError
          ? error.status === 409
            ? 'An account with this email already exists. Log in or use another email.'
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
          <p className="login-eyebrow">A JOYFUL BEGINNING</p>
          <h1>Make space for the moments you’ll remember forever.</h1>
          <p>Start bringing your people, plans and ideas together in one beautiful place.</p>
        </div>
        <p className="login-brand-footnote">A little planning. A lot of love.</p>
      </section>

      <section className="login-form-panel" aria-labelledby="register-title">
        <div className="login-form-wrap registration-form-wrap">
          <Link className="login-mobile-brand" to="/">
            ✿ Make My Marriage
          </Link>
          <p className="login-eyebrow login-form-eyebrow">LET’S MAKE IT BEAUTIFUL</p>
          <h2 id="register-title">Create your account</h2>
          <p className="login-intro">Your celebration planning starts right here.</p>

          <form
            className="login-form registration-form"
            noValidate
            onSubmit={form.handleSubmit((values) => {
              setFormError('');
              registration.mutate(values);
            })}
          >
            <div className="login-field">
              <label htmlFor="register-name">Full name</label>
              <input
                id="register-name"
                autoComplete="name"
                placeholder="Your full name"
                aria-invalid={Boolean(form.formState.errors.name)}
                aria-describedby={form.formState.errors.name ? 'register-name-error' : undefined}
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="login-field-error" id="register-name-error" role="alert">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="login-field">
              <label htmlFor="register-email">Email address</label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(form.formState.errors.email)}
                aria-describedby={form.formState.errors.email ? 'register-email-error' : undefined}
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="login-field-error" id="register-email-error" role="alert">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="login-field">
              <label htmlFor="register-password">Password</label>
              <div className="login-password-wrap">
                <input
                  id="register-password"
                  type={passwordVisible ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  aria-invalid={Boolean(form.formState.errors.password)}
                  aria-describedby={
                    form.formState.errors.password ? 'register-password-error' : undefined
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
                <p className="login-field-error" id="register-password-error" role="alert">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="login-field">
              <label htmlFor="register-confirm-password">Confirm password</label>
              <input
                id="register-confirm-password"
                type={passwordVisible ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Enter your password again"
                aria-invalid={Boolean(form.formState.errors.confirmPassword)}
                aria-describedby={
                  form.formState.errors.confirmPassword ? 'register-confirm-error' : undefined
                }
                {...form.register('confirmPassword')}
              />
              {form.formState.errors.confirmPassword && (
                <p className="login-field-error" id="register-confirm-error" role="alert">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {formError && (
              <p className="login-form-error" role="alert">
                {formError}
              </p>
            )}
            <button className="login-submit" type="submit" disabled={registration.isPending}>
              {registration.isPending ? 'Creating account…' : 'Create account'}
              {!registration.isPending && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <p className="login-register-prompt">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
          <p className="login-secure-note">
            <span aria-hidden="true">✦</span> Your details are private and secure
          </p>
        </div>
      </section>
    </main>
  );
}
