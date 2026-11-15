import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { HomePage } from '../routes/HomePage';
import { NotFoundPage } from '../routes/NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
