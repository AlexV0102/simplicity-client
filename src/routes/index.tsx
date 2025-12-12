import { createBrowserRouter, Navigate } from 'react-router';
import RootLayout from '../components/RootLayout';
import AnnouncementsList from '../pages/AnnouncementsList';
import AnnouncementDetail from '../pages/AnnouncementDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/announcements" replace />,
      },
      {
        path: 'announcements',
        element: <AnnouncementsList />,
      },
      {
        path: 'announcements/:id',
        element: <AnnouncementDetail />,
      },
    ],
  },
]);

