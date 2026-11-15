export type AppLanguage = 'en' | 'mr' | 'hi';

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiFailure {
  success: false;
  message: string;
  error: { code: string; details?: Array<{ field: string; message: string }> };
}

export interface HealthData {
  status: 'ok';
}
