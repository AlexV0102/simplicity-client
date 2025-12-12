import { createBrowserRouter, Navigate } from 'react-router';
import RootLayout from '../components/RootLayout';
import AnnouncementsList from '../pages/AnnouncementsList';
import AnnouncementDetail from '../pages/AnnouncementDetail';
import EditAnnouncement from '../pages/EditAnnouncement';

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
        path: 'announcements/new',
        element: <EditAnnouncement />,
      },
      {
        path: 'announcements/:id/edit',
        element: <EditAnnouncement />,
      },
      {
        path: 'announcements/:id',
        element: <AnnouncementDetail />,
      },
    ],
  },
]);
