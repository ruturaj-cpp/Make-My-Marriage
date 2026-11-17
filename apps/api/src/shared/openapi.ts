export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Make My Marriage API',
    version: '1.0.0',
    description: 'Versioned REST API foundation.',
  },
  servers: [{ url: '/api/v1' }],
  paths: {
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
