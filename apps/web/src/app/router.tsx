import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { HomePage } from '../routes/HomePage';
import { NotFoundPage } from '../routes/NotFoundPage';
import { LoginPage } from '../features/auth/LoginPage';
import { RegistrationPage } from '../features/auth/RegistrationPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegistrationPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
