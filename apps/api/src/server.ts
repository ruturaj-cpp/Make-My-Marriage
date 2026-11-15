import { app } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './database/connection';
import { logger } from './shared/logger';

let shuttingDown = false;

async function shutdown(signal: string, server: ReturnType<typeof app.listen>): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ signal }, 'Graceful shutdown started');
  server.close(async (error) => {
    if (error) logger.error({ err: error }, 'HTTP server close failed');
    await disconnectDatabase().catch((dbError: unknown) =>
      logger.error({ err: dbError }, 'Database shutdown failed'),
    );
    process.exit(error ? 1 : 0);
  });
}

async function start(): Promise<void> {
  await connectDatabase();
  const server = app.listen(env.API_PORT, () =>
    logger.info({ port: env.API_PORT }, 'API listening'),
  );
  process.on('SIGINT', () => void shutdown('SIGINT', server));
  process.on('SIGTERM', () => void shutdown('SIGTERM', server));
}

start().catch((error: unknown) => {
  logger.fatal({ err: error }, 'API startup failed');
  process.exitCode = 1;
});
