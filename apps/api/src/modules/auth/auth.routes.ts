import { Router } from 'express';
import { currentUserController, loginController, registerController } from './auth.controller';

export const authRouter = Router();

authRouter.post('/login', ...loginController);
authRouter.post('/register', ...registerController);
authRouter.get('/me', ...currentUserController);
