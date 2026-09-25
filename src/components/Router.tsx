import { MemberProvider } from '@/integrations';
import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import { getPageSeo } from '@/lib/seo';
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
import LeadershipPage from '@/components/pages/LeadershipPage';

// Keeps the tab title and description right when moving between pages
// in the browser (the server sets them on the first page load).
function PageSeoSync() {
  const { pathname } = useLocation();
  useEffect(() => {
    const { title, description } = getPageSeo(pathname);
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [pathname]);
  return null;
}

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <PageSeoSync />
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
        path: "leadership",
        element: <LeadershipPage />,
        routeMetadata: {
          pageIdentifier: 'leadership',
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
