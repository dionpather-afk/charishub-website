import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import SermonsPage from '@/components/pages/SermonsPage';
import EventsPage from '@/components/pages/EventsPage';
import GivingPage from '@/components/pages/GivingPage';
import AboutPage from '@/components/pages/AboutPage';
import GalleryPage from '@/components/pages/GalleryPage';
import ContactPage from '@/components/pages/ContactPage';
import DevotionalsPage from '@/components/pages/DevotionalsPage';
import MinistriesPage from '@/components/pages/MinistriesPage';
import HistoryPage from '@/components/pages/HistoryPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "sermons",
        element: <SermonsPage />,
        routeMetadata: {
          pageIdentifier: 'sermons',
        },
      },
      {
        path: "events",
        element: <EventsPage />,
        routeMetadata: {
          pageIdentifier: 'events',
        },
      },
      {
        path: "giving",
        element: <GivingPage />,
        routeMetadata: {
          pageIdentifier: 'giving',
        },
      },
      {
        path: "about",
        element: <AboutPage />,
        routeMetadata: {
          pageIdentifier: 'about',
        },
      },
      {
        path: "history",
        element: <HistoryPage />,
        routeMetadata: {
          pageIdentifier: 'history',
        },
      },
      {
        path: "gallery",
        element: <GalleryPage />,
        routeMetadata: {
          pageIdentifier: 'gallery',
        },
      },
      {
        path: "contact",
        element: <ContactPage />,
        routeMetadata: {
          pageIdentifier: 'contact',
        },
      },
      {
        path: "devotionals",
        element: <DevotionalsPage />,
        routeMetadata: {
          pageIdentifier: 'devotionals',
        },
      },
      {
        path: "ministries",
        element: <MinistriesPage />,
        routeMetadata: {
          pageIdentifier: 'ministries',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
