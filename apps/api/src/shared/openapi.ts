export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Make My Marriage API',
    version: '1.0.0',
    description: 'Versioned REST API foundation.',
  },
  servers: [{ url: '/api/v1' }],
  paths: {
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
