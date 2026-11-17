import type { RequestHandler } from 'express';
import { loginRequestSchema, registrationRequestSchema } from '@mmm/validators';
import { createCsrfToken } from '../../middleware/csrf-protection';
import { validateBody } from '../../middleware/validate-request';
import { sendSuccess } from '../../shared/api-response';
import {
  authenticateCredentials,
  DuplicateEmailError,
  getCurrentUser,
  registerUser,
} from './auth.service';

const currentUser: RequestHandler = async (request, response, next) => {
  if (!request.session.userId) {
    response.status(401).json({
      success: false,
      message: 'Authentication is required.',
      error: { code: 'AUTHENTICATION_REQUIRED' },
    });
    return;
  }
  try {
    const user = await getCurrentUser(request.session.userId);
    if (!user) {
      response.status(401).json({
        success: false,
        message: 'Authentication is required.',
        error: { code: 'AUTHENTICATION_REQUIRED' },
      });
      return;
    }
    sendSuccess(response, 'Current user retrieved', user);
  } catch (error) {
    next(error);
  }
};

const register: RequestHandler = async (request, response, next) => {
  try {
    const user = await registerUser(registrationRequestSchema.parse(request.body));
    sendSuccess(response, 'Registration successful', { user }, 201);
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      response.status(409).json({
        success: false,
        message: error.message,
        error: { code: 'EMAIL_ALREADY_EXISTS' },
      });
      return;
    }
    next(error);
  }
};

const login: RequestHandler = async (request, response, next) => {
  try {
    const user = await authenticateCredentials(loginRequestSchema.parse(request.body));
    if (!user) {
      response.status(401).json({
        success: false,
        message: 'Email or password is incorrect.',
        error: { code: 'INVALID_CREDENTIALS' },
      });
      return;
    }

    request.session.regenerate((regenerateError) => {
      if (regenerateError) {
        next(regenerateError);
        return;
      }

      request.session.userId = user.id;
      request.session.csrfToken = createCsrfToken();
      request.session.save((saveError) => {
        if (saveError) {
          next(saveError);
          return;
        }

        sendSuccess(response, 'Login successful', { user });
      });
    });
  } catch (error) {
    next(error);
  }
};

export const loginController: RequestHandler[] = [validateBody(loginRequestSchema), login];
export const registerController: RequestHandler[] = [
  validateBody(registrationRequestSchema),
  register,
];
export const currentUserController: RequestHandler[] = [currentUser];
