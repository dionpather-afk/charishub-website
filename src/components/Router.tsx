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
      },
      {
        path: "sermons",
        element: <SermonsPage />,
      },
      {
        path: "events",
        element: <EventsPage />,
      },
      {
        path: "giving",
        element: <GivingPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "leadership",
        element: <LeadershipPage />,
      },
      {
        path: "history",
        element: <HistoryPage />,
      },
      {
        path: "gallery",
        element: <GalleryPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "devotionals",
        element: <DevotionalsPage />,
      },
      {
        path: "ministries",
        element: <MinistriesPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/',
});

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
