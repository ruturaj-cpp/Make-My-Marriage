import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from '../shared/logger';

mongoose.connection.on('error', (error) =>
  logger.error({ err: error }, 'MongoDB connection error'),
);
mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI, { dbName: 'make_my_marriage' });
  logger.info('MongoDB connected');
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
