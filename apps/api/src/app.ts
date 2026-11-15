import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import MongoStore from 'connect-mongo';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { errorHandler } from './middleware/error-handler';
import { healthRouter } from './routes/health.routes';
import { csrfTokenRouter } from './routes/csrf-token.routes';
import { csrfProtection } from './middleware/csrf-protection';
import { logger } from './shared/logger';
import { openApiDocument } from './shared/openapi';

export const app = express();

app.disable('x-powered-by');
app.set('trust proxy', env.NODE_ENV === 'production' ? 1 : false);
app.use(helmet());
app.use(cors({ origin: env.WEB_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(pinoHttp({ logger }));
app.use(
  rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false }),
);
// Keep liveness and API docs independent of MongoDB so they are usable during outages.
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use(
  session({
    name: 'mmm.sid',
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: env.MONGODB_URI,
      dbName: 'make_my_marriage',
      collectionName: 'sessions',
    }),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);
app.use('/api/v1', csrfProtection);
app.use('/api/v1/csrf-token', csrfTokenRouter);

app.use((_request, response) => {
  response.status(404).json({
    success: false,
    message: 'Resource not found.',
    error: { code: 'RESOURCE_NOT_FOUND' },
  });
});
app.use(errorHandler);
