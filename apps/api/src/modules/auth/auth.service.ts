import * as argon2 from 'argon2';
import type { LoginRequest, RegistrationRequest } from '@mmm/validators';
import { UserModel } from '../users/models/user.model';
import { getOnboardingState } from '../onboarding/onboarding.service';

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
};

export class DuplicateEmailError extends Error {
  constructor() {
    super('An account with this email already exists.');
    this.name = 'DuplicateEmailError';
  }
}

export async function registerUser(input: RegistrationRequest): Promise<AuthenticatedUser> {
  if (await UserModel.exists({ email: input.email })) throw new DuplicateEmailError();

  const passwordHash = await argon2.hash(input.password, { type: argon2.argon2id });
  try {
    const user = await UserModel.create({
      name: input.name,
      email: input.email,
      passwordHash,
      preferredLanguage: 'en',
      status: 'active',
    });
    return { id: user._id.toString(), name: user.name, email: user.email };
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      throw new DuplicateEmailError();
    }
    throw error;
  }
}

export async function authenticateCredentials(
  credentials: LoginRequest,
): Promise<AuthenticatedUser | null> {
  const user = await UserModel.findOne({ email: credentials.email, status: 'active' })
    .select('+passwordHash')
    .exec();

  if (!user) {
    return null;
  }

  let passwordMatches = false;
  try {
    passwordMatches = await argon2.verify(user.passwordHash, credentials.password);
  } catch {
    // Treat malformed stored hashes like invalid credentials without exposing account details.
  }

  if (!passwordMatches) {
    return null;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

export async function getCurrentUser(userId: string) {
  const user = await UserModel.findById(userId)
    .select('name email preferredLanguage status')
    .lean();
  if (!user || user.status !== 'active') return null;
  const onboarding = await getOnboardingState(userId);
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    preferredLanguage: user.preferredLanguage,
    onboarding: {
      status: onboarding.status,
      currentStep: onboarding.currentStep,
      weddingId: onboarding.weddingId,
    },
  };
}
