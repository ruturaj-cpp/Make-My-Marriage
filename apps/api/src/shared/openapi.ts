export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Make My Marriage API',
    version: '1.0.0',
    description: 'Versioned REST API foundation.',
  },
  servers: [{ url: '/api/v1' }],
  paths: {
    '/auth/me': {
      get: {
        summary: 'Retrieve the authenticated user and onboarding route status',
        responses: {
          '200': { description: 'Authenticated user and onboarding status' },
          '401': { description: 'Authentication is required.' },
        },
      },
    },
    '/onboarding/me': {
      get: {
        summary: 'Get the authenticated user’s saved onboarding progress',
        responses: {
          '200': { description: 'Saved onboarding state' },
          '401': { description: 'Authentication is required.' },
        },
      },
      patch: {
        summary: 'Save onboarding progress for the authenticated user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['step', 'data'],
                properties: {
                  step: {
                    type: 'string',
                    enum: [
                      'welcome',
                      'couple-details',
                      'wedding-details',
                      'wedding-events',
                      'invite-partner',
                      'review',
                    ],
                  },
                  data: { type: 'object' },
                  completed: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Progress saved' },
          '401': { description: 'Authentication is required.' },
          '409': { description: 'The onboarding step cannot be saved yet.' },
          '422': { description: 'Request validation failed.' },
        },
      },
    },
    '/onboarding/complete': {
      post: {
        summary: 'Atomically create the wedding workspace and owner membership',
        responses: {
          '201': {
            description:
              'Workspace created; a pending invitation link is returned once if requested.',
          },
          '200': { description: 'Workspace already exists.' },
          '401': { description: 'Authentication is required.' },
          '409': { description: 'Required onboarding fields or membership conflict.' },
        },
      },
    },
    '/member-invitations/{token}/accept': {
      post: {
        summary: 'Accept a pending partner invitation with the invited account',
        parameters: [
          {
            in: 'path',
            name: 'token',
            required: true,
            schema: { type: 'string', minLength: 40, maxLength: 100 },
          },
        ],
        responses: {
          '200': { description: 'Invitation accepted and membership created.' },
          '401': { description: 'Authentication is required.' },
          '403': { description: 'Signed-in email does not match the invite.' },
          '404': { description: 'Invitation not found.' },
          '410': { description: 'Invitation expired or used.' },
        },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Register a user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', minLength: 2, maxLength: 100 },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8, maxLength: 128, format: 'password' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Account created; password hash is never returned.' },
          '403': { description: 'CSRF token is missing or invalid.' },
          '409': { description: 'An account with this email already exists.' },
          '422': { description: 'Request validation failed.' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Log in with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', format: 'password' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful; establishes the session cookie.' },
          '401': { description: 'Email or password is incorrect.' },
          '403': { description: 'CSRF token is missing or invalid.' },
          '422': { description: 'Request validation failed.' },
        },
      },
    },
    '/csrf-token': {
      get: {
        summary: 'Issue a CSRF token for the current session',
        responses: {
          '200': {
            description: 'Session-bound CSRF token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['success', 'message', 'data'],
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'CSRF token issued' },
                    data: {
                      type: 'object',
                      required: ['token'],
                      properties: { token: { type: 'string' } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/health': {
      get: {
        summary: 'API health check',
        responses: {
          '200': {
            description: 'API process is healthy',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/HealthResponse' } },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      HealthResponse: {
        type: 'object',
        required: ['success', 'message', 'data'],
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'API is healthy' },
          data: {
            type: 'object',
            required: ['status'],
            properties: { status: { type: 'string', example: 'ok' } },
          },
        },
      },
    },
  },
} as const;
