const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1';
type CsrfTokenResponse = { success: true; data: { token: string } };

let csrfTokenRequest: Promise<string> | undefined;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method?.toUpperCase() ?? 'GET';
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');

  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    csrfTokenRequest ??= fetch(`${API_BASE_URL}/csrf-token`, { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) throw new ApiError('Could not obtain a CSRF token.', response.status);
        const body = (await response.json()) as CsrfTokenResponse;
        return body.data.token;
      })
      .catch((error: unknown) => {
        csrfTokenRequest = undefined;
        throw error;
      });
    headers.set('X-CSRF-Token', await csrfTokenRequest);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new ApiError(body?.message ?? 'The request could not be completed.', response.status);
  }

  return (await response.json()) as T;
}
